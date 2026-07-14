import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dto/testimonial.dto';

@ApiTags('Testimonials')
@Controller()
export class TestimonialsController {
  constructor(private readonly testimonials: TestimonialsService) {}

  @Get('testimonials')
  publicList() {
    return this.testimonials.publicList();
  }

  @Get('admin/testimonials')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  adminList() {
    return this.testimonials.adminList();
  }

  @Post('admin/testimonials')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateTestimonialDto) {
    return this.testimonials.create(dto);
  }

  @Patch('admin/testimonials/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateTestimonialDto) {
    return this.testimonials.update(id, dto);
  }

  @Delete('admin/testimonials/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.testimonials.remove(id);
  }
}
