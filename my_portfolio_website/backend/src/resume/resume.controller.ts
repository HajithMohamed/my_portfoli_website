import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateResumeDto } from './resume.dto';
import { ResumeService } from './resume.service';

@ApiTags('Resume')
@Controller()
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Get('resume/latest')
  latest() {
    return this.resumeService.latest();
  }

  @Get('admin/resume')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.resumeService.findAll();
  }

  @Post('admin/resume')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateResumeDto) {
    return this.resumeService.create(dto);
  }

  @Patch('admin/resume/:id/active')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  setActive(@Param('id') id: string) {
    return this.resumeService.setActive(id);
  }

  @Delete('admin/resume/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.resumeService.remove(id);
  }
}
