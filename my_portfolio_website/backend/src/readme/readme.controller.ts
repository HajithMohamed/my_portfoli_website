import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ReadmeSyncService } from './readme-sync.service';

@ApiTags('README sync')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/readme')
export class ReadmeController {
  constructor(private readonly readme: ReadmeSyncService) {}

  /** Called by the admin panel after every sign-in, and by "Check now". */
  @Post('sync')
  @Throttle({ default: { limit: 6, ttl: 60_000 } })
  sync() {
    return this.readme.sync();
  }

  @Get('updates')
  updates() {
    return this.readme.updates();
  }

  @Post('updates/:id/acknowledge')
  acknowledge(@Param('id') id: string) {
    return this.readme.acknowledge(id);
  }
}
