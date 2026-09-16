import { PartialType } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCertificateDto {
  @IsString()
  @MaxLength(200)
  title!: string;

  @IsString()
  @MaxLength(200)
  issuer!: string;

  @IsOptional()
  @IsIn(['certification', 'achievement'])
  type?: string;

  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  credentialUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  imageUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  courseUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  instructor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  instructorUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  studentUrl?: string;

  @IsOptional()
  @IsInt()
  durationHours?: number;

  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpdateCertificateDto extends PartialType(CreateCertificateDto) {}
