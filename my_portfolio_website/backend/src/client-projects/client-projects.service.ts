import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientProjectDto } from './dto/create-client-project.dto';
import { UpdateClientProjectDto } from './dto/update-client-project.dto';
import { CreateMilestoneDto, UpdateMilestoneDto } from './dto/manage-milestone.dto';
import { CreateClientTaskDto, UpdateClientTaskDto } from './dto/manage-task.dto';

@Injectable()
export class ClientProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  private enrichProject(project: any) {
    const milestones = project.milestones ?? [];
    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter((m: any) => m.isDone).length;
    const progressPercentage =
      totalMilestones > 0
        ? Math.round((completedMilestones / totalMilestones) * 100)
        : 0;

    const tasks = project.tasks ?? [];
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t: any) => t.isCompleted).length;

    return {
      ...project,
      progressPercentage,
      totalMilestones,
      completedMilestones,
      totalTasks,
      completedTasks,
    };
  }

  async findAll() {
    const projects = await this.prisma.clientProject.findMany({
      include: {
        milestones: { orderBy: { order: 'asc' } },
        tasks: { orderBy: { order: 'asc' } },
        request: {
          select: {
            id: true,
            referenceId: true,
            projectType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return projects.map((p) => this.enrichProject(p));
  }

  async findOne(id: string) {
    const project = await this.prisma.clientProject.findUnique({
      where: { id },
      include: {
        milestones: { orderBy: { order: 'asc' } },
        tasks: { orderBy: { order: 'asc' } },
        request: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Client project not found');
    }
    return this.enrichProject(project);
  }

  async create(dto: CreateClientProjectDto) {
    const { startDate, deadline, ...rest } = dto;
    const project = await this.prisma.clientProject.create({
      data: {
        ...rest,
        startDate: startDate ? new Date(startDate) : undefined,
        deadline: deadline ? new Date(deadline) : undefined,
      },
      include: {
        milestones: true,
        tasks: true,
      },
    });

    return this.enrichProject(project);
  }

  async update(id: string, dto: UpdateClientProjectDto) {
    await this.ensure(id);
    const { startDate, deadline, ...rest } = dto;
    const project = await this.prisma.clientProject.update({
      where: { id },
      data: {
        ...rest,
        startDate: startDate ? new Date(startDate) : undefined,
        deadline: deadline ? new Date(deadline) : undefined,
      },
      include: {
        milestones: { orderBy: { order: 'asc' } },
        tasks: { orderBy: { order: 'asc' } },
      },
    });

    return this.enrichProject(project);
  }

  async remove(id: string) {
    await this.ensure(id);
    await this.prisma.clientProject.delete({ where: { id } });
    return { ok: true };
  }

  // Milestones CRUD
  async addMilestone(projectId: string, dto: CreateMilestoneDto) {
    await this.ensure(projectId);
    const { dueDate, ...rest } = dto;
    return this.prisma.milestone.create({
      data: {
        ...rest,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        projectId,
      },
    });
  }

  async updateMilestone(projectId: string, milestoneId: string, dto: UpdateMilestoneDto) {
    await this.ensure(projectId);
    const { dueDate, ...rest } = dto;
    return this.prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        ...rest,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
    });
  }

  async removeMilestone(projectId: string, milestoneId: string) {
    await this.ensure(projectId);
    await this.prisma.milestone.delete({ where: { id: milestoneId } });
    return { ok: true };
  }

  // Tasks CRUD
  async addTask(projectId: string, dto: CreateClientTaskDto) {
    await this.ensure(projectId);
    return this.prisma.clientTask.create({
      data: {
        ...dto,
        projectId,
      },
    });
  }

  async updateTask(projectId: string, taskId: string, dto: UpdateClientTaskDto) {
    await this.ensure(projectId);
    return this.prisma.clientTask.update({
      where: { id: taskId },
      data: dto,
    });
  }

  async removeTask(projectId: string, taskId: string) {
    await this.ensure(projectId);
    await this.prisma.clientTask.delete({ where: { id: taskId } });
    return { ok: true };
  }

  private async ensure(id: string) {
    const exists = await this.prisma.clientProject.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Client project not found');
    }
  }
}
