import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { classifyDatabaseError, PrismaService } from './prisma/prisma.service';

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  root() {
    return {
      service: 'hz-labs-api',
      status: 'ok',
      docs: '/docs',
    };
  }

  @Get('health')
  async health() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        service: 'hz-labs-api',
        status: 'ok',
        database: 'connected',
        checkedAt: new Date().toISOString(),
      };
    } catch (error) {
      const diagnosis = classifyDatabaseError(error);
      throw new ServiceUnavailableException({
        service: 'hz-labs-api',
        status: 'degraded',
        database: 'unavailable',
        reason: diagnosis.reason,
        hint: diagnosis.hint,
        checkedAt: new Date().toISOString(),
      });
    }
  }
}
