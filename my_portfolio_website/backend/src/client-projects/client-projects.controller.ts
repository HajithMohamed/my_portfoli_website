import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ClientProjectsService } from './client-projects.service';
import { CreateClientProjectDto } from './dto/create-client-project.dto';
import { UpdateClientProjectDto } from './dto/update-client-project.dto';
import { CreateMilestoneDto, UpdateMilestoneDto } from './dto/manage-milestone.dto';
import { CreateClientTaskDto, UpdateClientTaskDto } from './dto/manage-task.dto';

@ApiTags('Client Projects')
@Controller('admin/client-projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ClientProjectsController {
  constructor(private readonly clientProjectsService: ClientProjectsService) {}

  @Get()
  findAll() {
    return this.clientProjectsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateClientProjectDto) {
    return this.clientProjectsService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientProjectsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClientProjectDto) {
    return this.clientProjectsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientProjectsService.remove(id);
  }

  // Milestones
  @Post(':id/milestones')
  addMilestone(@Param('id') id: string, @Body() dto: CreateMilestoneDto) {
    return this.clientProjectsService.addMilestone(id, dto);
  }

  @Patch(':id/milestones/:milestoneId')
  updateMilestone(
    @Param('id') id: string,
    @Param('milestoneId') milestoneId: string,
    @Body() dto: UpdateMilestoneDto
  ) {
    return this.clientProjectsService.updateMilestone(id, milestoneId, dto);
  }

  @Delete(':id/milestones/:milestoneId')
  removeMilestone(@Param('id') id: string, @Param('milestoneId') milestoneId: string) {
    return this.clientProjectsService.removeMilestone(id, milestoneId);
  }

  // Tasks
  @Post(':id/tasks')
  addTask(@Param('id') id: string, @Body() dto: CreateClientTaskDto) {
    return this.clientProjectsService.addTask(id, dto);
  }

  @Patch(':id/tasks/:taskId')
  updateTask(
    @Param('id') id: string,
    @Param('taskId') taskId: string,
    @Body() dto: UpdateClientTaskDto
  ) {
    return this.clientProjectsService.updateTask(id, taskId, dto);
  }

  @Delete(':id/tasks/:taskId')
  removeTask(@Param('id') id: string, @Param('taskId') taskId: string) {
    return this.clientProjectsService.removeTask(id, taskId);
  }
}
