import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClientProjectStatus } from '@prisma/client';
import { IsDateString, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateClientProjectDto {
  @ApiProperty({ example: 'Acme E-Commerce Platform' })
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  requestId?: string;

  @ApiProperty({ example: 'Alice Smith' })
  @IsString()
  clientName: string;

  @ApiProperty({ example: 'alice@acme.com' })
  @IsEmail()
  clientEmail: string;

  @ApiPropertyOptional({ example: 'Acme Inc' })
  @IsOptional()
  @IsString()
  clientCompany?: string;

  @ApiPropertyOptional({ enum: ClientProjectStatus })
  @IsOptional()
  @IsEnum(ClientProjectStatus)
  status?: ClientProjectStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiPropertyOptional({ example: '$12,000' })
  @IsOptional()
  @IsString()
  budget?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
