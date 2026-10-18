import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RequestStatus } from '@prisma/client';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

describe('RequestsService', () => {
  const prisma = {
    projectRequest: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    clientProject: {
      create: jest.fn(),
    },
  };

  const service = new RequestsService(prisma as never);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const validDto: CreateRequestDto = {
      name: 'Jane Doe',
      email: 'jane@acme.com',
      company: 'Acme Corp',
      projectType: 'Web Application',
      details: 'Building an enterprise portal for inventory management.',
      requiredFeatures: ['Authentication', 'Dashboard'],
      referenceSites: 'https://linear.app',
      timeline: '1-2 months',
      budgetRange: '$5k - $10k',
      preferredContact: 'email',
    };

    it('rejects submissions where the honeypot field is filled', async () => {
      const spamDto: CreateRequestDto = {
        ...validDto,
        honeypot: 'http://spam-link.ru',
      };

      await expect(service.create(spamDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(spamDto)).rejects.toThrow('Form submission rejected');
      expect(prisma.projectRequest.create).not.toHaveBeenCalled();
    });

    it('rejects bot submissions completed in under 2 seconds', async () => {
      const fastDto: CreateRequestDto = {
        ...validDto,
        submittedAtMs: Date.now() - 500, // 500ms elapsed
      };

      await expect(service.create(fastDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(fastDto)).rejects.toThrow('Form submitted too quickly');
      expect(prisma.projectRequest.create).not.toHaveBeenCalled();
    });

    it('successfully creates project request and returns public reference ID', async () => {
      const normalDto: CreateRequestDto = {
        ...validDto,
        submittedAtMs: Date.now() - 15000, // 15s elapsed
      };

      prisma.projectRequest.create.mockResolvedValue({
        id: 'req-1',
        referenceId: 'HZ-TEST-REF1',
        ...normalDto,
      });

      const result = await service.create(normalDto);

      expect(result.referenceId).toMatch(/^HZ-[A-Z0-9]+-[A-Z0-9]+$/);
      expect(result.message).toContain('Response window < 24h');
      expect(prisma.projectRequest.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: 'Jane Doe',
            email: 'jane@acme.com',
            projectType: 'Web Application',
            referenceId: expect.stringMatching(/^HZ-[A-Z0-9]+-[A-Z0-9]+$/),
          }),
        })
      );
    });

    it('correctly maps attachments if provided in the payload', async () => {
      const dtoWithAttachments: CreateRequestDto = {
        ...validDto,
        attachments: [
          {
            fileUrl: 'https://res.cloudinary.com/demo/file.pdf',
            fileName: 'spec.pdf',
            fileSize: 1024,
            fileType: 'application/pdf',
          },
        ],
      };

      prisma.projectRequest.create.mockResolvedValue({ id: 'req-2' });

      await service.create(dtoWithAttachments);

      expect(prisma.projectRequest.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            attachments: {
              create: [
                {
                  fileUrl: 'https://res.cloudinary.com/demo/file.pdf',
                  publicId: undefined,
                  fileName: 'spec.pdf',
                  fileSize: 1024,
                  fileType: 'application/pdf',
                },
              ],
            },
          }),
        })
      );
    });
  });

  describe('findAll', () => {
    it('returns all project requests sorted by createdAt desc', async () => {
      const mockList = [{ id: '1', name: 'Alice' }, { id: '2', name: 'Bob' }];
      prisma.projectRequest.findMany.mockResolvedValue(mockList);

      const result = await service.findAll();
      expect(result).toEqual(mockList);
      expect(prisma.projectRequest.findMany).toHaveBeenCalledWith({
        where: undefined,
        include: {
          attachments: true,
          clientProject: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('filters by status when provided', async () => {
      prisma.projectRequest.findMany.mockResolvedValue([]);

      await service.findAll(RequestStatus.NEW);
      expect(prisma.projectRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: RequestStatus.NEW },
        })
      );
    });
  });

  describe('findOne', () => {
    it('returns request if exists', async () => {
      const mockReq = { id: 'req-1', name: 'Alice' };
      prisma.projectRequest.findUnique.mockResolvedValue(mockReq);

      const result = await service.findOne('req-1');
      expect(result).toEqual(mockReq);
    });

    it('throws NotFoundException if request does not exist', async () => {
      prisma.projectRequest.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('throws NotFoundException if request does not exist', async () => {
      prisma.projectRequest.findUnique.mockResolvedValue(null);

      const updateDto: UpdateRequestDto = { status: RequestStatus.IN_REVIEW };
      await expect(service.update('non-existent', updateDto)).rejects.toThrow(
        NotFoundException
      );
      expect(prisma.projectRequest.update).not.toHaveBeenCalled();
    });

    it('updates request when it exists', async () => {
      prisma.projectRequest.findUnique.mockResolvedValue({ id: 'req-1' });
      prisma.projectRequest.update.mockResolvedValue({
        id: 'req-1',
        status: RequestStatus.IN_REVIEW,
      });

      const updateDto: UpdateRequestDto = { status: RequestStatus.IN_REVIEW };
      const result = await service.update('req-1', updateDto);

      expect(result.status).toBe(RequestStatus.IN_REVIEW);
      expect(prisma.projectRequest.update).toHaveBeenCalledWith({
        where: { id: 'req-1' },
        data: updateDto,
        include: { attachments: true },
      });
    });
  });

  describe('remove', () => {
    it('throws NotFoundException if request does not exist', async () => {
      prisma.projectRequest.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
      expect(prisma.projectRequest.delete).not.toHaveBeenCalled();
    });

    it('deletes request and returns ok', async () => {
      prisma.projectRequest.findUnique.mockResolvedValue({ id: 'req-1' });
      prisma.projectRequest.delete.mockResolvedValue({ id: 'req-1' });

      const result = await service.remove('req-1');
      expect(result).toEqual({ ok: true });
      expect(prisma.projectRequest.delete).toHaveBeenCalledWith({
        where: { id: 'req-1' },
      });
    });
  });

  describe('convertToClientProject', () => {
    it('converts request into a client project and updates status to APPROVED', async () => {
      const mockReq = {
        id: 'req-1',
        name: 'Jane Doe',
        email: 'jane@acme.com',
        company: 'Acme Corp',
        projectType: 'SaaS Platform',
        budgetRange: '$5,000 - $10,000',
        referenceId: 'HZ-1234-ABCD',
        details: 'Full scope portal.',
      };

      prisma.projectRequest.findUnique.mockResolvedValue(mockReq);
      prisma.clientProject.create.mockResolvedValue({
        id: 'client-proj-1',
        name: "Jane Doe's SaaS Platform",
        status: 'PLANNING',
      });
      prisma.projectRequest.update.mockResolvedValue({
        ...mockReq,
        status: 'APPROVED',
      });

      const result = await service.convertToClientProject('req-1');

      expect(result.id).toBe('client-proj-1');
      expect(prisma.clientProject.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: "Jane Doe's SaaS Platform",
            clientName: 'Jane Doe',
            clientEmail: 'jane@acme.com',
            status: 'PLANNING',
          }),
        })
      );
      expect(prisma.projectRequest.update).toHaveBeenCalledWith({
        where: { id: 'req-1' },
        data: { status: 'APPROVED' },
      });
    });
  });
});
