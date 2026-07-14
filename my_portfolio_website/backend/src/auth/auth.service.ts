import { timingSafeEqual } from 'node:crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import type { CookieOptions } from 'express';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../common/types/authenticated-request';
import { LoginDto } from './dto/login.dto';
import { SESSION_COOKIE } from './auth.constants';

export type RequestContext = { ip?: string; userAgent?: string };

type AttemptRecord = { fails: number; lockedUntil: number };

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes
const DEFAULT_SESSION_TTL_MINUTES = 120;

/**
 * Single-administrator auth backed by environment variables (no admin user
 * table). Credentials are checked against ADMIN_EMAIL + ADMIN_PASSWORD (or an
 * argon2 ADMIN_PASSWORD_HASH), and a short-lived JWT is handed to the caller to
 * be stored in an HTTP-only cookie. Failed attempts are rate-limited per IP and
 * every auth event is written to the activity log.
 */
@Injectable()
export class AuthService {
  // In-memory failed-login tracker keyed by client IP. Resets on restart, which
  // is fine for a single-instance admin surface; the throttler is a second layer.
  private readonly attempts = new Map<string, AttemptRecord>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto, context: RequestContext) {
    const ip = context.ip ?? 'unknown';
    this.assertNotLocked(ip);

    const valid = await this.verifyCredentials(dto.email, dto.password);
    if (!valid) {
      this.registerFailure(ip);
      await this.log('login.failed', false, context, { email: dto.email });
      throw new UnauthorizedException('Invalid credentials');
    }

    this.attempts.delete(ip);
    const user = this.adminUser();
    const token = await this.signSession(user);
    await this.log('login.success', true, context);
    return { token, user };
  }

  async logout(context: RequestContext) {
    await this.log('logout', true, context);
    return { ok: true };
  }

  me(user: AuthUser) {
    return { email: user.email, name: user.name, role: user.role };
  }

  /** Cookie attributes shared by login (set) and logout (clear). */
  cookieOptions(): CookieOptions {
    const isProd = process.env.NODE_ENV === 'production';
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: this.sessionTtlSeconds() * 1000,
    };
  }

  readonly cookieName = SESSION_COOKIE;

  // ---- internals -----------------------------------------------------------

  private sessionTtlSeconds(): number {
    const raw = this.configService.get<string>('ADMIN_SESSION_TTL_MINUTES');
    const minutes = Number(raw);
    const safe =
      Number.isFinite(minutes) && minutes > 0
        ? minutes
        : DEFAULT_SESSION_TTL_MINUTES;
    return safe * 60;
  }

  private adminUser(): AuthUser {
    return {
      sub: 'admin',
      email: this.configService.getOrThrow<string>('ADMIN_EMAIL'),
      name: this.configService.get<string>('ADMIN_NAME') ?? 'Administrator',
      role: 'ADMIN',
    };
  }

  private signSession(user: AuthUser): Promise<string> {
    return this.jwtService.signAsync(user, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.sessionTtlSeconds(),
    });
  }

  private async verifyCredentials(
    email: string,
    password: string,
  ): Promise<boolean> {
    const expectedEmail = this.configService.getOrThrow<string>('ADMIN_EMAIL');
    const emailOk = this.safeEqual(
      email.trim().toLowerCase(),
      expectedEmail.trim().toLowerCase(),
    );

    const hash = this.configService.get<string>('ADMIN_PASSWORD_HASH');
    let passwordOk = false;
    if (hash) {
      try {
        passwordOk = await argon2.verify(hash, password);
      } catch {
        passwordOk = false;
      }
    } else {
      const expected = this.configService.getOrThrow<string>('ADMIN_PASSWORD');
      passwordOk = this.safeEqual(password, expected);
    }

    // Both branches are always evaluated before this point, so the boolean AND
    // here does not introduce a meaningful timing side-channel.
    return emailOk && passwordOk;
  }

  private safeEqual(a: string, b: string): boolean {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
      // Keep timing roughly uniform even on a length mismatch, then fail.
      timingSafeEqual(bufA, bufA);
      return false;
    }
    return timingSafeEqual(bufA, bufB);
  }

  private assertNotLocked(ip: string) {
    const record = this.attempts.get(ip);
    if (record && record.lockedUntil > Date.now()) {
      const seconds = Math.ceil((record.lockedUntil - Date.now()) / 1000);
      throw new UnauthorizedException(
        `Too many failed attempts. Try again in ${seconds}s.`,
      );
    }
  }

  private registerFailure(ip: string) {
    const record = this.attempts.get(ip) ?? { fails: 0, lockedUntil: 0 };
    record.fails += 1;
    if (record.fails >= MAX_FAILED_ATTEMPTS) {
      record.lockedUntil = Date.now() + LOCKOUT_MS;
      record.fails = 0;
    }
    this.attempts.set(ip, record);
  }

  private async log(
    action: string,
    success: boolean,
    context: RequestContext,
    meta?: Record<string, unknown>,
  ) {
    try {
      await this.prisma.adminActivityLog.create({
        data: {
          action,
          success,
          ip: context.ip,
          userAgent: context.userAgent,
          meta: meta as Prisma.InputJsonValue | undefined,
        },
      });
    } catch {
      // Never let an audit-log write failure block authentication.
    }
  }
}
