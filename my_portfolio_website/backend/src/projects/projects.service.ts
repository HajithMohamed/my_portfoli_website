import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  publicProjects() {
    return this.prisma.project.findMany({
      where: { status: ProjectStatus.ACTIVE },
      include: this.includes(),
      orderBy: [{ featured: 'desc' }, { updatedAt: 'desc' }],
    });
  }

  adminProjects() {
    return this.prisma.project.findMany({
      include: this.includes(),
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findBySlug(slug: string, includeDrafts = false) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: this.includes(),
    });

    if (
      !project ||
      (!includeDrafts && project.status !== ProjectStatus.ACTIVE)
    ) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  create(dto: ProjectDto) {
    return this.prisma.project.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        description: dto.description,
        techStack: dto.techStack,
        githubUrl: dto.githubUrl,
        liveUrl: dto.liveUrl,
        coverImage: dto.coverImage,
        category: dto.category,
        status: dto.status,
        featured: dto.featured,
        outcome: dto.outcome,
        media: dto.media?.length
          ? { create: dto.media.map((item, order) => ({ ...item, order })) }
          : undefined,
        caseStudy: dto.caseStudy?.length
          ? { create: dto.caseStudy.map((item, order) => ({ ...item, order })) }
          : undefined,
      },
      include: this.includes(),
    });
  }

  async update(id: string, dto: Partial<ProjectDto>) {
    await this.ensure(id);
    return this.prisma.project.update({
      where: { id },
      data: {
        ...this.projectFields(dto),
        ...(dto.media
          ? {
              media: {
                deleteMany: {},
                create: dto.media.map((item, order) => ({ ...item, order })),
              },
            }
          : {}),
        ...(dto.caseStudy
          ? {
              caseStudy: {
                deleteMany: {},
                create: dto.caseStudy.map((item, order) => ({
                  ...item,
                  order,
                })),
              },
            }
          : {}),
      },
      include: this.includes(),
    });
  }

  async remove(id: string) {
    await this.ensure(id);
    await this.prisma.project.delete({ where: { id } });
    return { ok: true };
  }

  private projectFields(dto: Partial<ProjectDto>) {
    return {
      title: dto.title,
      slug: dto.slug,
      description: dto.description,
      techStack: dto.techStack,
      githubUrl: dto.githubUrl,
      liveUrl: dto.liveUrl,
      coverImage: dto.coverImage,
      category: dto.category,
      status: dto.status,
      featured: dto.featured,
      outcome: dto.outcome,
    };
  }

  private includes() {
    return {
      media: { orderBy: { order: 'asc' as const } },
      caseStudy: { orderBy: { order: 'asc' as const } },
    };
  }

  private async ensure(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
  }
}
