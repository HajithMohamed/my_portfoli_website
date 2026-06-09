import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResumeDto } from './resume.dto';

@Injectable()
export class ResumeService {
  constructor(private readonly prisma: PrismaService) {}

  latest() {
    return this.prisma.cvAsset.findFirst({
      where: { isActive: true },
      orderBy: [{ version: 'desc' }, { createdAt: 'desc' }],
    });
  }

  findAll() {
    return this.prisma.cvAsset.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async create(dto: CreateResumeDto) {
    const latest = await this.prisma.cvAsset.findFirst({
      orderBy: { version: 'desc' },
    });
    if (dto.isActive ?? true) {
      await this.prisma.cvAsset.updateMany({ data: { isActive: false } });
    }
    return this.prisma.cvAsset.create({
      data: {
        ...dto,
        isActive: dto.isActive ?? true,
        version: (latest?.version ?? 0) + 1,
      },
    });
  }

  async setActive(id: string) {
    const cv = await this.prisma.cvAsset.findUnique({ where: { id } });
    if (!cv) {
      throw new NotFoundException('CV not found');
    }
    await this.prisma.cvAsset.updateMany({ data: { isActive: false } });
    return this.prisma.cvAsset.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async remove(id: string) {
    await this.prisma.cvAsset.delete({ where: { id } });
    return { ok: true };
  }
}
