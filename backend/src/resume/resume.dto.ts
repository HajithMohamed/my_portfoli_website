import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateResumeDto {
  @ApiProperty({ example: 'Mohamed Hajith CV' })
  @IsString()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_protocol: true })
  fileUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  publicId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
