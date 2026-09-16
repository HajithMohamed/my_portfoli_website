import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Supabase's connection pooler caps total clients at 15 (free tier). Prisma
 * otherwise sizes its pool to the host CPU count (num_cpus * 2 + 1), which a
 * single dev instance can use to exhaust the pooler — and hot-reloads that
 * briefly overlap the old + new process make it worse. Pin a small pool via the
 * connection string so we stay well under the ceiling regardless of hardware.
 */
function buildDatabaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return undefined;
  }
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has('connection_limit')) {
      parsed.searchParams.set('connection_limit', '5');
    }
    if (!parsed.searchParams.has('pool_timeout')) {
      parsed.searchParams.set('pool_timeout', '20');
    }
    return parsed.toString();
  } catch {
    // If DATABASE_URL isn't a parseable URL, let Prisma surface the error.
    return url;
  }
}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private connected = false;
  constructor() {
    const url = buildDatabaseUrl();
    super(url ? { datasources: { db: { url } } } : undefined);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.connected = true;
    } catch (error) {
      // Authentication does not depend on the CMS database. Keep the API alive
      // so admin login and health checks remain available during DB outages.
      this.logger.error(
        `Database unavailable; starting in degraded mode: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async onModuleDestroy() {
    if (this.connected) await this.$disconnect();
  }
}
