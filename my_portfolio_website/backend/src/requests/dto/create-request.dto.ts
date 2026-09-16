import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AttachmentDto {
  @ApiProperty()
  @IsString()
  fileUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  publicId?: string;

  @ApiProperty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsNumber()
  fileSize: number;

  @ApiProperty()
  @IsString()
  fileType: string;
}

export class CreateRequestDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({ example: 'Acme Corp' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ example: 'jane@acme.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+1 555-0199' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Web Application' })
  @IsString()
  projectType: string;

  @ApiProperty({ example: 'High performance internal workflow portal.' })
  @IsString()
  @MinLength(10)
  details: string;

  @ApiPropertyOptional({ example: ['Authentication', 'Dashboard'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredFeatures?: string[];

  @ApiPropertyOptional({ example: 'https://linear.app' })
  @IsOptional()
  @IsString()
  referenceSites?: string;

  @ApiPropertyOptional({ example: '2-3 months' })
  @IsOptional()
  @IsString()
  timeline?: string;

  @ApiPropertyOptional({ example: '$5k - $10k' })
  @IsOptional()
  @IsString()
  budgetRange?: string;

  @ApiPropertyOptional({ example: 'email' })
  @IsOptional()
  @IsString()
  preferredContact?: string;

  /** Honeypot security field — must remain blank */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  honeypot?: string;

  /** Minimum time-to-submit verification timestamp */
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  submittedAtMs?: number;

  @ApiPropertyOptional({ type: [AttachmentDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];
}
