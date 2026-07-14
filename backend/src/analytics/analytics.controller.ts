import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AnalyticsService, RANGE_KEYS, RangeKey } from './analytics.service';
import { CollectDto } from './dto/collect.dto';

@ApiTags('Analytics')
@Controller()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('analytics/collect')
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  collect(@Body() dto: CollectDto, @Req() req: Request) {
    return this.analyticsService.collect(
      dto,
      clientIp(req),
      req.headers['user-agent'],
    );
  }

  @Get('admin/analytics/dashboard')
  @UseGuards(JwtAuthGuard)
  dashboard(@Query('range') range?: string) {
    const key = (range ?? '30d') as RangeKey;
    if (!RANGE_KEYS.includes(key)) {
      throw new BadRequestException(
        `range must be one of ${RANGE_KEYS.join(', ')}`,
      );
    }
    return this.analyticsService.dashboard(key);
  }
}

function clientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip ?? 'unknown';
}
