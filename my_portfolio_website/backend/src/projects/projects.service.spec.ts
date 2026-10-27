import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AssetType, ProjectStatus } from '@prisma/client';
import { ProjectsService } from './projects.service';
import { ProjectDto } from './dto/project.dto';

describe('ProjectsService', () => {
  const prisma = {
    project: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const service = new ProjectsService(prisma as never);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('publicProjects', () => {
    it('returns only published projects in CMS order', async () => {
      const mockProjects = [
        {
          id: '1',
          title: 'Shoe Bank',
          status: ProjectStatus.ACTIVE,
          featured: true,
        },
      ];
      prisma.project.findMany.mockResolvedValue(mockProjects);

      const result = await service.publicProjects();
      expect(result).toEqual(mockProjects);
      expect(prisma.project.findMany).toHaveBeenCalledWith({
        where: { status: ProjectStatus.ACTIVE },
        include: {
          media: { orderBy: { order: 'asc' } },
          caseStudy: { orderBy: { order: 'asc' } },
        },
        orderBy: [{ homepageOrder: 'asc' }, { createdAt: 'asc' }],
      });
    });
  });

  describe('adminProjects', () => {
    it('returns all projects for admin view', async () => {
      const mockProjects = [
        { id: '1', title: 'Shoe Bank', status: ProjectStatus.ACTIVE },
        { id: '2', title: 'Internal Draft', status: ProjectStatus.ARCHIVED },
      ];
      prisma.project.findMany.mockResolvedValue(mockProjects);

      const result = await service.adminProjects();
      expect(result).toEqual(mockProjects);
      expect(prisma.project.findMany).toHaveBeenCalledWith({
        include: {
          media: { orderBy: { order: 'asc' } },
          caseStudy: { orderBy: { order: 'asc' } },
        },
        orderBy: { updatedAt: 'desc' },
      });
    });
  });

  describe('publicVisibility', () => {
    it('returns visibility status for projects with githubUrl', async () => {
      const mockVisibility = [
        {
          id: '1',
          githubUrl: 'https://github.com/org/repo',
          status: ProjectStatus.ACTIVE,
        },
      ];
      prisma.project.findMany.mockResolvedValue(mockVisibility);

      const result = await service.publicVisibility();
      expect(result).toEqual(mockVisibility);
      expect(prisma.project.findMany).toHaveBeenCalledWith({
        where: { githubUrl: { not: null }, status: ProjectStatus.ACTIVE },
        select: { id: true, githubUrl: true, status: true },
      });
    });
  });

  describe('findBySlug', () => {
    it('returns an active project when found', async () => {
      const mockProject = {
        id: '1',
        slug: 'shoe-bank',
        status: ProjectStatus.ACTIVE,
      };
      prisma.project.findUnique.mockResolvedValue(mockProject);

      const result = await service.findBySlug('shoe-bank');
      expect(result).toEqual(mockProject);
      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: { slug: 'shoe-bank' },
        include: {
          media: { orderBy: { order: 'asc' } },
          caseStudy: { orderBy: { order: 'asc' } },
        },
      });
    });

    it('throws NotFoundException when project does not exist', async () => {
      prisma.project.findUnique.mockResolvedValue(null);
      await expect(service.findBySlug('unknown')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws NotFoundException for non-active project when includeDrafts is false', async () => {
      const mockDraft = {
        id: '2',
        slug: 'draft-project',
        status: ProjectStatus.ARCHIVED,
      };
      prisma.project.findUnique.mockResolvedValue(mockDraft);

      await expect(service.findBySlug('draft-project', false)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('returns non-active project when includeDrafts is true', async () => {
      const mockDraft = {
        id: '2',
        slug: 'draft-project',
        status: ProjectStatus.ARCHIVED,
      };
      prisma.project.findUnique.mockResolvedValue(mockDraft);

      const result = await service.findBySlug('draft-project', true);
      expect(result).toEqual(mockDraft);
    });
  });

  describe('create', () => {
    it('creates a project with media and caseStudy mapped to order', async () => {
      const dto: ProjectDto = {
        title: 'Shoe Bank',
        slug: 'shoe-bank',
        description: 'Wholesale footwear system',
        techStack: ['PHP', 'MySQL'],
        githubUrl:
          'https://github.com/HajithMohamed/Footwear_Business_Management_System',
        liveUrl: 'https://shoebank.lk',
        coverImage: '/projects/shoe-bank-cover.png',
        category: 'Enterprise System',
        status: ProjectStatus.ACTIVE,
        featured: true,
        outcome: 'Reduced invoice calculation time',
        media: [{ url: 'https://example.com/img1.png', alt: 'Overview' }],
        caseStudy: [{ heading: 'Goal', body: 'Manage wholesale inventory' }],
      };

      const createdProject = { id: 'proj-1', ...dto };
      prisma.project.create.mockResolvedValue(createdProject);

      const result = await service.create(dto);
      expect(result).toEqual(createdProject);
      expect(prisma.project.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: 'Shoe Bank',
          slug: 'shoe-bank',
          media: {
            create: [
              {
                url: 'https://example.com/img1.png',
                alt: 'Overview',
                order: 0,
              },
            ],
          },
          caseStudy: {
            create: [
              { heading: 'Goal', body: 'Manage wholesale inventory', order: 0 },
            ],
          },
        }),
        include: {
          media: { orderBy: { order: 'asc' } },
          caseStudy: { orderBy: { order: 'asc' } },
        },
      });
    });
  });

  describe('update', () => {
    it('saves multiple Cloudinary photos and a video in their chosen gallery order', async () => {
      prisma.project.findUnique.mockResolvedValue({ id: 'gallery' });
      const media = [
        {
          url: 'https://res.cloudinary.com/test/image/upload/overview.png',
          alt: 'Overview',
          type: AssetType.IMAGE,
          publicId: 'hz-labs/projects/overview',
          provider: 'cloudinary',
        },
        {
          url: 'https://res.cloudinary.com/test/image/upload/details.png',
          alt: 'Details',
          type: AssetType.IMAGE,
          publicId: 'hz-labs/projects/details',
          provider: 'cloudinary',
        },
        {
          url: 'https://res.cloudinary.com/test/video/upload/demo.mp4',
          alt: 'Demo',
          type: AssetType.VIDEO,
          publicId: 'hz-labs/projects/demo',
          provider: 'cloudinary',
          posterUrl: 'https://res.cloudinary.com/test/video/upload/demo.jpg',
        },
      ];

      await service.update('gallery', { media });

      expect(prisma.project.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'gallery' },
          data: expect.objectContaining({
            media: {
              deleteMany: {},
              create: media.map((item, order) => ({ ...item, order })),
            },
          }),
        }),
      );
    });

    it('holds a project without changing its media or listing choices', async () => {
      prisma.project.findUnique.mockResolvedValue({ id: 'held' });
      await service.update('held', { status: ProjectStatus.DRAFT });
      const input = prisma.project.update.mock.calls[0][0] as {
        data: Record<string, unknown>;
      };
      expect(input.data.status).toBe(ProjectStatus.DRAFT);
      expect(input.data.media).toBeUndefined();
      expect(input.data.showOnHomepage).toBeUndefined();
      expect(input.data.showOnProjectsPage).toBeUndefined();
    });

    it('persists independent placement and ordered video metadata', async () => {
      prisma.project.findUnique.mockResolvedValue({ id: 'video' });
      const media = {
        url: 'https://res.cloudinary.com/test/video/upload/demo.mp4',
        alt: 'Demo',
        type: AssetType.VIDEO,
        posterUrl: 'https://res.cloudinary.com/test/video/upload/demo.jpg',
        publicId: 'demo',
        provider: 'cloudinary',
        mimeType: 'video/mp4',
        bytes: 1024,
      };
      await service.update('video', {
        showOnHomepage: false,
        showOnProjectsPage: true,
        media: [media],
      });
      const input = prisma.project.update.mock.calls[0][0] as {
        data: Record<string, unknown>;
      };
      expect(input.data).toMatchObject({
        showOnHomepage: false,
        showOnProjectsPage: true,
        media: { deleteMany: {}, create: [{ ...media, order: 0 }] },
      });
    });

    it('rejects direct external video URLs before saving', async () => {
      await expect(
        service.update('video', {
          media: [
            {
              url: 'https://untrusted.example/demo.mp4',
              alt: 'Demo',
              type: AssetType.VIDEO,
            },
          ],
        }),
      ).rejects.toThrow(BadRequestException);
      expect(prisma.project.update).not.toHaveBeenCalled();
    });
    it('updates project fields and re-creates related records', async () => {
      prisma.project.findUnique.mockResolvedValue({
        id: 'proj-1',
        slug: 'shoe-bank',
      });
      const updatedMock = { id: 'proj-1', title: 'Updated Shoe Bank' };
      prisma.project.update.mockResolvedValue(updatedMock);

      const result = await service.update('proj-1', {
        title: 'Updated Shoe Bank',
        caseStudy: [{ heading: 'New Goal', body: 'Updated body' }],
      });

      expect(result).toEqual(updatedMock);
      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: 'proj-1' },
        data: expect.objectContaining({
          title: 'Updated Shoe Bank',
          caseStudy: {
            deleteMany: {},
            create: [{ heading: 'New Goal', body: 'Updated body', order: 0 }],
          },
        }),
        include: {
          media: { orderBy: { order: 'asc' } },
          caseStudy: { orderBy: { order: 'asc' } },
        },
      });
    });

    it('throws NotFoundException if updating non-existent project', async () => {
      prisma.project.findUnique.mockResolvedValue(null);
      await expect(
        service.update('missing', { title: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  it('saves a complete editorial reorder in one transaction', async () => {
    await service.reorder(['second', 'first']);
    expect(prisma.project.update).toHaveBeenNthCalledWith(1, {
      where: { id: 'second' },
      data: { homepageOrder: 0 },
    });
    expect(prisma.project.update).toHaveBeenNthCalledWith(2, {
      where: { id: 'first' },
      data: { homepageOrder: 1 },
    });
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
  });

  describe('remove', () => {
    it('deletes project after ensuring it exists', async () => {
      prisma.project.findUnique.mockResolvedValue({ id: 'proj-1' });
      prisma.project.delete.mockResolvedValue({ id: 'proj-1' });

      const result = await service.remove('proj-1');
      expect(result).toEqual({ ok: true });
      expect(prisma.project.delete).toHaveBeenCalledWith({
        where: { id: 'proj-1' },
      });
    });

    it('throws NotFoundException if deleting non-existent project', async () => {
      prisma.project.findUnique.mockResolvedValue(null);
      await expect(service.remove('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
