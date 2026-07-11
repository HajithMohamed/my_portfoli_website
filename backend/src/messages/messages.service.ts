import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateMessageDto) {
    return this.prisma.message.create({ data: dto });
  }

  findAll() {
    return this.prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async markRead(id: string) {
    await this.ensure(id);
    return this.prisma.message.update({ where: { id }, data: { read: true } });
  }

  async remove(id: string) {
    await this.ensure(id);
    await this.prisma.message.delete({ where: { id } });
    return { ok: true };
  }

  private async ensure(id: string) {
    const message = await this.prisma.message.findUnique({ where: { id } });
    if (!message) {
      throw new NotFoundException('Message not found');
    }
  }
}
