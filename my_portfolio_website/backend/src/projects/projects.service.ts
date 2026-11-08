import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { AssetType, ProjectStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ReadmeSyncService } from '../readme/readme-sync.service';
import { ProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    // Adds the synced GitHub README summary to each project when available.
    @Optional() private readonly readme?: ReadmeSyncService,
  ) {}

  async publicProjects() {
    const projects = await this.prisma.project.findMany({
      where: { status: ProjectStatus.ACTIVE },
      include: this.includes(),
      orderBy: [{ homepageOrder: 'asc' }, { createdAt: 'asc' }],
    });
    return this.withReadme(projects);
  }

  async adminProjects() {
    const projects = await this.prisma.project.findMany({
      include: this.includes(),
      orderBy: { updatedAt: 'desc' },
    });
    return this.withReadme(projects);
  }

  publicVisibility() {
    return this.prisma.project.findMany({
      where: { githubUrl: { not: null }, status: ProjectStatus.ACTIVE },
      select: { id: true, githubUrl: true, status: true },
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

    const [withReadme] = await this.withReadme([project]);
    return withReadme;
  }

  create(dto: ProjectDto) {
    this.validateMedia(dto);
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
        featured: dto.showOnHomepage ?? dto.featured,
        showOnHomepage: dto.showOnHomepage ?? dto.featured ?? false,
        showOnProjectsPage: dto.showOnProjectsPage ?? true,
        homepageOrder: dto.homepageOrder,
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
    this.validateMedia(dto);
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

  async reorder(ids: string[]) {
    await this.prisma.$transaction(
      ids.map((id, homepageOrder) =>
        this.prisma.project.update({ where: { id }, data: { homepageOrder } }),
      ),
    );
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
      featured: dto.showOnHomepage ?? dto.featured,
      showOnHomepage: dto.showOnHomepage ?? dto.featured,
      showOnProjectsPage: dto.showOnProjectsPage,
      homepageOrder: dto.homepageOrder,
      outcome: dto.outcome,
    };
  }

  private validateMedia(dto: Partial<ProjectDto>) {
    for (const item of dto.media ?? []) {
      if (
        item.type === AssetType.VIDEO &&
        !/^https:\/\/res\.cloudinary\.com\/[^/]+\/video\/upload\//.test(
          item.url,
        )
      ) {
        throw new BadRequestException(
          'Upload demo videos through the secured media studio',
        );
      }
    }
  }

  private withReadme<T extends { id: string }>(projects: T[]) {
    return this.readme
      ? this.readme.attach(projects)
      : Promise.resolve(projects);
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
