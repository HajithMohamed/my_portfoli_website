import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dto/testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Public: only featured testimonials, ordered. */
  publicList() {
    return this.prisma.testimonial.findMany({
      where: { featured: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  }

  adminList() {
    return this.prisma.testimonial.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  }

  create(dto: CreateTestimonialDto) {
    return this.prisma.testimonial.create({ data: dto });
  }

  update(id: string, dto: UpdateTestimonialDto) {
    return this.prisma.testimonial.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.testimonial.delete({ where: { id } });
  }
}
