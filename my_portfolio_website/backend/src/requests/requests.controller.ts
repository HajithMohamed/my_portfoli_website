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
import { RequestStatus } from '@prisma/client';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestsService } from './requests.service';

@ApiTags('Requests')
@Controller()
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post('requests')
  @Throttle({ default: { limit: 5, ttl: 3600_000 } })
  create(@Body() dto: CreateRequestDto) {
    return this.requestsService.create(dto);
  }

  @Get('admin/requests')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('status') status?: RequestStatus) {
    return this.requestsService.findAll(status);
  }

  @Get('admin/requests/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(id);
  }

  @Patch('admin/requests/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateRequestDto) {
    return this.requestsService.update(id, dto);
  }

  @Delete('admin/requests/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.requestsService.remove(id);
  }

  @Post('admin/requests/:id/convert-to-project')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  convertToProject(@Param('id') id: string) {
    return this.requestsService.convertToClientProject(id);
  }
}
