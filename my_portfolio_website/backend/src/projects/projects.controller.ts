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
import {
  ProjectDto,
  ReorderProjectsDto,
  UpdateProjectDto,
} from './dto/project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('projects')
  publicProjects() {
    return this.projectsService.publicProjects();
  }

  @Get('projects/visibility')
  publicVisibility() {
    return this.projectsService.publicVisibility();
  }

  @Get('projects/:slug')
  publicBySlug(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug);
  }

  @Get('admin/projects')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  adminProjects() {
    return this.projectsService.adminProjects();
  }

  @Get('admin/projects/:slug')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  adminBySlug(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug, true);
  }

  @Post('admin/projects')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: ProjectDto) {
    return this.projectsService.create(dto);
  }

  @Patch('admin/projects/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Post('admin/projects/reorder')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  reorder(@Body() dto: ReorderProjectsDto) {
    return this.projectsService.reorder(dto.ids);
  }

  @Delete('admin/projects/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
