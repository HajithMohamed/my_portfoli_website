import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Supabase's connection pooler caps total clients at 15 (free tier). Prisma
 * otherwise sizes its pool to the host CPU count (num_cpus * 2 + 1), which a
 * single dev instance can use to exhaust the pooler — and hot-reloads that
 * briefly overlap the old + new process make it worse. Pin a small pool via the
 * connection string so we stay well under the ceiling regardless of hardware.
 *
 * On Vercel Serverless Functions, concurrent requests may spin up separate
 * function instances, so default each instance to connection_limit=1 and enable
 * pgbouncer mode automatically on port 6543 (Supabase Transaction Pooler).
 */
export function buildDatabaseUrl(
  rawUrl: string | undefined = process.env.DATABASE_URL,
  isServerless: boolean = process.env.VERCEL === '1',
): string | undefined {
  const url = rawUrl?.trim();
  if (!url) {
    return undefined;
  }
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has('connection_limit')) {
      parsed.searchParams.set('connection_limit', isServerless ? '1' : '5');
    }
    if (!parsed.searchParams.has('pool_timeout')) {
      parsed.searchParams.set('pool_timeout', '20');
    }
    if (parsed.port === '6543' && !parsed.searchParams.has('pgbouncer')) {
      parsed.searchParams.set('pgbouncer', 'true');
    }
    return parsed.toString();
  } catch {
    // If DATABASE_URL isn't a parseable URL, let Prisma surface the error.
    return url;
  }
}

export type DatabaseDiagnosis = {
  reason:
    | 'missing_database_url'
    | 'supabase_direct_ipv6_url'
    | 'prisma_engine_missing'
    | 'database_auth_failed'
    | 'migrations_not_applied'
    | 'database_unreachable';
  hint: string;
};

export function classifyDatabaseError(
  error: unknown,
  rawUrl: string | undefined = process.env.DATABASE_URL,
): DatabaseDiagnosis {
  const configured = rawUrl?.trim();
  if (!configured) {
    return {
      reason: 'missing_database_url',
      hint: 'Set DATABASE_URL in your backend Vercel Environment Variables using the Supabase IPv4 pooler connection string, then redeploy.',
    };
  }

  try {
    const parsed = new URL(configured);
    if (/^db\.[a-z0-9-]+\.supabase\.co$/i.test(parsed.hostname)) {
      return {
        reason: 'supabase_direct_ipv6_url',
        hint: 'Direct db.<project>.supabase.co hosts are IPv6-only and unreachable from Vercel Functions. Switch DATABASE_URL to your Supabase IPv4 Session or Transaction Pooler URL (*.pooler.supabase.com).',
      };
    }
  } catch {
    // Fall through to message inspection.
  }

  const message = error instanceof Error ? error.message : String(error);
  if (
    message.includes('Query Engine') ||
    message.includes('rhel-openssl') ||
    message.includes('libquery_engine')
  ) {
    return {
      reason: 'prisma_engine_missing',
      hint: 'Prisma Query Engine binary was not found for this runtime. Ensure prisma generate runs during build with rhel-openssl-3.0.x in binaryTargets.',
    };
  }

  if (
    message.includes('P1000') ||
    /authentication failed|Tenant or user not found/i.test(message)
  ) {
    return {
      reason: 'database_auth_failed',
      hint: 'Database authentication failed. Verify the username (postgres.<project-ref> for Supabase pooler) and password in DATABASE_URL.',
    };
  }

  if (
    message.includes('P2021') ||
    /relation .* does not exist/i.test(message)
  ) {
    return {
      reason: 'migrations_not_applied',
      hint: 'Database schema is missing required tables. Run Prisma migrations (npm run prisma:deploy --workspace backend) against your production DATABASE_URL.',
    };
  }

  return {
    reason: 'database_unreachable',
    hint: 'Could not reach PostgreSQL. Verify DATABASE_URL points to an active IPv4-accessible database and your Supabase project is active.',
  };
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

  onModuleInit() {
    void this.connectInBackground();
  }

  private async connectInBackground() {
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
