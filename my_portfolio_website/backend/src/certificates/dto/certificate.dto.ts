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
  @IsInt()
  order?: number;
}

export class UpdateCertificateDto extends PartialType(CreateCertificateDto) {}
