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
import { SkillDto } from './dto/skill.dto';
import { SkillsService } from './skills.service';

@ApiTags('Skills')
@Controller()
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get('skills')
  findAll() {
    return this.skillsService.findAll();
  }

  @Get('admin/skills')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  adminFindAll() {
    return this.skillsService.findAll();
  }

  @Post('admin/skills')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: SkillDto) {
    return this.skillsService.create(dto);
  }

  @Patch('admin/skills/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: Partial<SkillDto>) {
    return this.skillsService.update(id, dto);
  }

  @Delete('admin/skills/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.skillsService.remove(id);
  }
}
