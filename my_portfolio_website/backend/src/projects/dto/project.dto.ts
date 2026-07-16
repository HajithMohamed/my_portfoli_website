import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProjectMediaDto {
  @ApiProperty()
  @IsUrl({ require_protocol: true })
  url!: string;

  @ApiProperty()
  @IsString()
  alt!: string;
}

export class CaseStudySectionDto {
  @ApiProperty({ example: 'Problem' })
  @IsString()
  heading!: string;

  @ApiProperty()
  @IsString()
  body!: string;
}

export class ProjectDto {
  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  techStack!: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_protocol: true })
  githubUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_protocol: true })
  liveUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_protocol: true })
  coverImage?: string;

  @ApiProperty()
  @IsString()
  category!: string;

  @ApiPropertyOptional({ enum: ProjectStatus })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  outcome?: string;

  @ApiPropertyOptional({ type: [ProjectMediaDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectMediaDto)
  media?: ProjectMediaDto[];

  @ApiPropertyOptional({ type: [CaseStudySectionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CaseStudySectionDto)
  caseStudy?: CaseStudySectionDto[];
}
