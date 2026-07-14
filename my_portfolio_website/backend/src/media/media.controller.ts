import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MediaService } from './media.service';
import { CreateMediaDto, UpdateMediaDto } from './dto/media.dto';

@ApiTags('Media')
@Controller()
export class MediaController {
  constructor(private readonly media: MediaService) {}

  @Get('media')
  publicList(@Query('category') category?: string) {
    return this.media.publicList(category);
  }

  @Get('admin/media')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  adminList() {
    return this.media.adminList();
  }

  @Post('admin/media')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateMediaDto) {
    return this.media.create(dto);
  }

  @Patch('admin/media/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateMediaDto) {
    return this.media.update(id, dto);
  }

  @Delete('admin/media/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.media.remove(id);
  }
}
