import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ProjectDto } from './dto/project.dto';
import { ProjectsService } from './projects.service';

@ApiTags('Projects')
@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('projects')
  publicProjects() {
    return this.projectsService.publicProjects();
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
  update(@Param('id') id: string, @Body() dto: Partial<ProjectDto>) {
    return this.projectsService.update(id, dto);
  }

  @Delete('admin/projects/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
