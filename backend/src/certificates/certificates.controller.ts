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
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto, UpdateCertificateDto } from './dto/certificate.dto';

@ApiTags('Certificates')
@Controller()
export class CertificatesController {
  constructor(private readonly certificates: CertificatesService) {}

  @Get('certificates')
  publicList() {
    return this.certificates.publicList();
  }

  @Get('admin/certificates')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  adminList() {
    return this.certificates.adminList();
  }

  @Post('admin/certificates')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateCertificateDto) {
    return this.certificates.create(dto);
  }

  @Patch('admin/certificates/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateCertificateDto) {
    return this.certificates.update(id, dto);
  }

  @Delete('admin/certificates/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.certificates.remove(id);
  }
}
