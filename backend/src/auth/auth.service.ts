import { randomBytes } from 'node:crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../common/types/authenticated-request';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.adminUser.findUnique({
      where: { email: dto.email },
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await argon2.verify(user.passwordHash, dto.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueTokens({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  }

  async refresh(refreshToken: string) {
    const storedTokens = await this.prisma.refreshToken.findMany({
      where: {
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    for (const stored of storedTokens) {
      if (await argon2.verify(stored.tokenHash, refreshToken)) {
        await this.prisma.refreshToken.update({
          where: { id: stored.id },
          data: { revokedAt: new Date() },
        });
        return this.issueTokens({
          sub: stored.user.id,
          email: stored.user.email,
          name: stored.user.name,
          role: stored.user.role,
        });
      }
    }

    throw new UnauthorizedException('Invalid refresh token');
  }

  async logout(refreshToken?: string) {
    if (!refreshToken) {
      return { ok: true };
    }

    const storedTokens = await this.prisma.refreshToken.findMany({
      where: { revokedAt: null },
    });
    for (const stored of storedTokens) {
      if (await argon2.verify(stored.tokenHash, refreshToken)) {
        await this.prisma.refreshToken.update({
          where: { id: stored.id },
          data: { revokedAt: new Date() },
        });
      }
    }

    return { ok: true };
  }

  async me(user: AuthUser) {
    return this.prisma.adminUser.findUnique({
      where: { id: user.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  private async issueTokens(user: AuthUser) {
    const accessExpiresIn =
      this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m';
    const accessToken = await this.jwtService.signAsync(user, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: accessExpiresIn as never,
    });

    const refreshToken = randomBytes(64).toString('hex');
    const days = Number(
      this.configService.get<string>('JWT_REFRESH_EXPIRES_DAYS') ?? 7,
    );
    await this.prisma.refreshToken.create({
      data: {
        tokenHash: await argon2.hash(refreshToken),
        userId: user.sub,
        expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
      user,
    };
  }
}
