import { PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateMediaDto {
  @IsString()
  @MaxLength(1024)
  url!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  publicId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  alt?: string;

  @IsOptional()
  @IsIn(['profile', 'gallery', 'about'])
  category?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpdateMediaDto extends PartialType(CreateMediaDto) {}
