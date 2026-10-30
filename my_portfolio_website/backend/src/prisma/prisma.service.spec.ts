import { ServiceUnavailableException } from '@nestjs/common';
import { HealthController } from '../health.controller';
import {
  buildDatabaseUrl,
  classifyDatabaseError,
  PrismaService,
} from './prisma.service';

describe('PrismaService Vercel & Supabase helpers', () => {
  it('uses connection_limit=1 and enables pgbouncer on port 6543 in serverless mode', () => {
    const built = buildDatabaseUrl(
      'postgresql://postgres.ref:secret@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
      true,
    );
    expect(built).toBeDefined();
    const parsed = new URL(built!);
    expect(parsed.searchParams.get('connection_limit')).toBe('1');
    expect(parsed.searchParams.get('pool_timeout')).toBe('20');
    expect(parsed.searchParams.get('pgbouncer')).toBe('true');
  });

  it('preserves connection_limit=5 on non-serverless hosts', () => {
    const built = buildDatabaseUrl(
      'postgresql://postgres.ref:secret@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres',
      false,
    );
    const parsed = new URL(built!);
    expect(parsed.searchParams.get('connection_limit')).toBe('5');
    expect(parsed.searchParams.has('pgbouncer')).toBe(false);
  });

  it('classifies missing DATABASE_URL and IPv6 direct Supabase URLs safely without leaking secrets', () => {
    expect(classifyDatabaseError(new Error('fail'), '')).toMatchObject({
      reason: 'missing_database_url',
    });

    const ipv6Diagnosis = classifyDatabaseError(
      new Error('Can not reach database server'),
      'postgresql://postgres:supersecret@db.abcdefghijk.supabase.co:5432/postgres',
    );
    expect(ipv6Diagnosis.reason).toBe('supabase_direct_ipv6_url');
    expect(ipv6Diagnosis.hint).not.toContain('supersecret');
  });

  it('returns structured 503 diagnostics from HealthController when database is unavailable', async () => {
    const originalDbUrl = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;
    try {
      const prismaMock = {
        $queryRaw: jest.fn().mockRejectedValue(new Error('Env var not found')),
      } as unknown as PrismaService;
      const controller = new HealthController(prismaMock);

      await expect(controller.health()).rejects.toThrow(
        ServiceUnavailableException,
      );
      try {
        await controller.health();
      } catch (err) {
        const response = (err as ServiceUnavailableException).getResponse();
        expect(response).toMatchObject({
          service: 'hz-labs-api',
          status: 'degraded',
          database: 'unavailable',
          reason: 'missing_database_url',
        });
      }
    } finally {
      if (originalDbUrl === undefined) {
        delete process.env.DATABASE_URL;
      } else {
        process.env.DATABASE_URL = originalDbUrl;
      }
    }
  });
});
