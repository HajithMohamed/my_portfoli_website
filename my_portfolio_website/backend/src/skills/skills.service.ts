import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SkillDto } from './dto/skill.dto';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.skill.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }, { name: 'asc' }] });
  }

  create(dto: SkillDto) {
    return this.prisma.skill.create({ data: dto });
  }

  async update(id: string, dto: Partial<SkillDto>) {
    await this.ensure(id);
    return this.prisma.skill.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.ensure(id);
    await this.prisma.skill.delete({ where: { id } });
    return { ok: true };
  }

  private async ensure(id: string) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) {
      throw new NotFoundException('Skill not found');
    }
  }
}
