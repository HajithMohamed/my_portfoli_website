import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GithubService } from './github.service';

@ApiTags('GitHub')
@Controller()
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('github/summary')
  summary() {
    return this.githubService.latestSummary();
  }

  @Get('admin/suggestions')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  suggestions() {
    return this.githubService.suggestions();
  }

  @Post('admin/github/sync')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  sync() {
    return this.githubService.sync();
  }

  @Post('admin/suggestions/:id/approve')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  approve(@Param('id') id: string) {
    return this.githubService.approveSuggestion(id);
  }

  @Post('admin/suggestions/:id/reject')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  reject(@Param('id') id: string) {
    return this.githubService.rejectSuggestion(id);
  }
}
