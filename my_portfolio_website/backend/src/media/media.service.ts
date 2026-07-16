import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMediaDto, UpdateMediaDto } from './dto/media.dto';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  publicList(category?: string) {
    return this.prisma.mediaAsset.findMany({
      where: category ? { category } : undefined,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  }

  adminList() {
    return this.prisma.mediaAsset.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }, { createdAt: 'desc' }],
    });
  }

  create(dto: CreateMediaDto) {
    return this.prisma.mediaAsset.create({ data: dto });
  }

  update(id: string, dto: UpdateMediaDto) {
    return this.prisma.mediaAsset.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.mediaAsset.delete({ where: { id } });
  }
}
