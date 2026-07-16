import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCertificateDto, UpdateCertificateDto } from './dto/certificate.dto';

@Injectable()
export class CertificatesService {
  constructor(private readonly prisma: PrismaService) {}

  publicList() {
    return this.prisma.certificate.findMany({
      orderBy: [{ order: 'asc' }, { issueDate: 'desc' }],
    });
  }

  adminList() {
    return this.publicList();
  }

  create(dto: CreateCertificateDto) {
    return this.prisma.certificate.create({ data: this.toData(dto) });
  }

  update(id: string, dto: UpdateCertificateDto) {
    return this.prisma.certificate.update({ where: { id }, data: this.toData(dto) });
  }

  remove(id: string) {
    return this.prisma.certificate.delete({ where: { id } });
  }

  private toData<T extends { issueDate?: string }>(dto: T) {
    const { issueDate, ...rest } = dto;
    return {
      ...rest,
      ...(issueDate !== undefined
        ? { issueDate: issueDate ? new Date(issueDate) : null }
        : {}),
    };
  }
}
