import { NotFoundException } from '@nestjs/common';
import { ProjectStatus } from '@prisma/client';
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
  };

  const service = new ProjectsService(prisma as never);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('publicProjects', () => {
    it('returns only active projects ordered by featured and updatedAt', async () => {
      const mockProjects = [
        { id: '1', title: 'Shoe Bank', status: ProjectStatus.ACTIVE, featured: true },
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
        orderBy: [{ featured: 'desc' }, { updatedAt: 'desc' }],
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
      const mockVisibility = [{ id: '1', githubUrl: 'https://github.com/org/repo', status: ProjectStatus.ACTIVE }];
      prisma.project.findMany.mockResolvedValue(mockVisibility);

      const result = await service.publicVisibility();
      expect(result).toEqual(mockVisibility);
      expect(prisma.project.findMany).toHaveBeenCalledWith({
        where: { githubUrl: { not: null } },
        select: { id: true, githubUrl: true, status: true },
      });
    });
  });

  describe('findBySlug', () => {
    it('returns an active project when found', async () => {
      const mockProject = { id: '1', slug: 'shoe-bank', status: ProjectStatus.ACTIVE };
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
      await expect(service.findBySlug('unknown')).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException for non-active project when includeDrafts is false', async () => {
      const mockDraft = { id: '2', slug: 'draft-project', status: ProjectStatus.ARCHIVED };
      prisma.project.findUnique.mockResolvedValue(mockDraft);

      await expect(service.findBySlug('draft-project', false)).rejects.toThrow(NotFoundException);
    });

    it('returns non-active project when includeDrafts is true', async () => {
      const mockDraft = { id: '2', slug: 'draft-project', status: ProjectStatus.ARCHIVED };
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
        githubUrl: 'https://github.com/HajithMohamed/Footwear_Business_Management_System',
        liveUrl: 'https://shoebank.lk',
        coverImage: '/projects/shoe-bank-cover.png',
        category: 'Enterprise System',
        status: ProjectStatus.ACTIVE,
        featured: true,
        outcome: 'Reduced invoice calculation time',
        media: [{ url: '/img1.png', type: 'IMAGE', caption: 'Overview' }],
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
            create: [{ url: '/img1.png', type: 'IMAGE', caption: 'Overview', order: 0 }],
          },
          caseStudy: {
            create: [{ heading: 'Goal', body: 'Manage wholesale inventory', order: 0 }],
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
    it('updates project fields and re-creates related records', async () => {
      prisma.project.findUnique.mockResolvedValue({ id: 'proj-1', slug: 'shoe-bank' });
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
      await expect(service.update('missing', { title: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deletes project after ensuring it exists', async () => {
      prisma.project.findUnique.mockResolvedValue({ id: 'proj-1' });
      prisma.project.delete.mockResolvedValue({ id: 'proj-1' });

      const result = await service.remove('proj-1');
      expect(result).toEqual({ ok: true });
      expect(prisma.project.delete).toHaveBeenCalledWith({ where: { id: 'proj-1' } });
    });

    it('throws NotFoundException if deleting non-existent project', async () => {
      prisma.project.findUnique.mockResolvedValue(null);
      await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
    });
  });
});
