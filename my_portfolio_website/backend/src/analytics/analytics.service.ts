import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  track(type: string, path?: string, metadata?: Record<string, unknown>) {
    return this.prisma.analyticsEvent.create({ data: { type, path, metadata } });
  }

  summary() {
    return this.prisma.analyticsEvent.groupBy({
      by: ['type'],
      _count: { type: true },
      orderBy: { _count: { type: 'desc' } },
    });
  }
}
