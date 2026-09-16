import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RequestStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

@Injectable()
export class RequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRequestDto) {
    // 1. Honeypot check
    if (dto.honeypot && dto.honeypot.trim().length > 0) {
      throw new BadRequestException('Form submission rejected');
    }

    // 2. Minimum time-to-submit check (bot protection: under 2 seconds is flagged)
    if (dto.submittedAtMs) {
      const duration = Date.now() - dto.submittedAtMs;
      if (duration < 2000) {
        throw new BadRequestException('Form submitted too quickly');
      }
    }

    // 3. Generate high-entropy reference identifier
    const randPart = Math.random().toString(36).slice(2, 6).toUpperCase();
    const timePart = Date.now().toString(36).toUpperCase().slice(-4);
    const referenceId = `HZ-${timePart}-${randPart}`;

    const {
      name,
      company,
      email,
      phone,
      projectType,
      details,
      requiredFeatures = [],
      referenceSites,
      timeline,
      budgetRange,
      preferredContact = 'email',
      attachments = [],
    } = dto;

    await this.prisma.projectRequest.create({
      data: {
        referenceId,
        name,
        company,
        email,
        phone,
        projectType,
        details,
        requiredFeatures,
        referenceSites,
        timeline,
        budgetRange,
        preferredContact,
        attachments: {
          create: attachments.map((att) => ({
            fileUrl: att.fileUrl,
            publicId: att.publicId,
            fileName: att.fileName,
            fileSize: att.fileSize,
            fileType: att.fileType,
          })),
        },
      },
    });

    // Only return the public reference ID per security rule
    return {
      referenceId,
      message: 'Project request received. Response window < 24h.',
    };
  }

  async findAll(status?: RequestStatus) {
    return this.prisma.projectRequest.findMany({
      where: status ? { status } : undefined,
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
  }

  async findOne(id: string) {
    const request = await this.prisma.projectRequest.findUnique({
      where: { id },
      include: {
        attachments: true,
        clientProject: true,
      },
    });

    if (!request) {
      throw new NotFoundException('Project request not found');
    }
    return request;
  }

  async update(id: string, dto: UpdateRequestDto) {
    await this.ensure(id);
    return this.prisma.projectRequest.update({
      where: { id },
      data: dto,
      include: { attachments: true },
    });
  }

  async remove(id: string) {
    await this.ensure(id);
    await this.prisma.projectRequest.delete({ where: { id } });
    return { ok: true };
  }

  async convertToClientProject(id: string) {
    const request = await this.findOne(id);

    // Create client project linked to this request
    const clientProject = await this.prisma.clientProject.create({
      data: {
        name: `${request.name}'s ${request.projectType}`,
        requestId: request.id,
        clientName: request.name,
        clientEmail: request.email,
        clientCompany: request.company,
        budget: request.budgetRange,
        notes: `Converted from request ${request.referenceId}.\n\nDetails: ${request.details}`,
        status: 'PLANNING',
        milestones: {
          create: [
            { name: 'Discovery & Architecture Specification', order: 1 },
            { name: 'Core Implementation & API Contracts', order: 2 },
            { name: 'Client Review & Staging Deployment', order: 3 },
            { name: 'Production Launch', order: 4 },
          ],
        },
      },
      include: {
        milestones: true,
      },
    });

    // Update request status to APPROVED
    await this.prisma.projectRequest.update({
      where: { id },
      data: { status: 'APPROVED' },
    });

    return clientProject;
  }

  private async ensure(id: string) {
    const exists = await this.prisma.projectRequest.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Project request not found');
    }
  }
}
