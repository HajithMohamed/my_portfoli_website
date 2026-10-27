import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { AssetType, ProjectStatus } from '@prisma/client';
import {
  IsArray,
  ArrayUnique,
  ArrayMaxSize,
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  Min,
  IsOptional,
  IsString,
  IsUrl,
  ValidateBy,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

const mediaUrl = () =>
  ValidateBy({
    name: 'mediaUrl',
    validator: {
      validate: (value: unknown) => {
        if (typeof value !== 'string') return false;
        if (
          /^\/(projects|brand)\/[a-zA-Z0-9_./-]+$/.test(value) &&
          !value.includes('..')
        )
          return true;
        try {
          const url = new URL(value);
          return (
            url.protocol === 'https:' &&
            !url.username &&
            !url.password &&
            url.hostname.includes('.') &&
            !url.hostname.endsWith('.local') &&
            !/^\d+\.\d+\.\d+\.\d+$/.test(url.hostname)
          );
        } catch {
          return false;
        }
      },
      defaultMessage: () =>
        'Use an HTTPS media URL or an existing project asset path',
    },
  });

export class ProjectMediaDto {
  @ApiProperty()
  @mediaUrl()
  url!: string;

  @ApiProperty()
  @IsString()
  alt!: string;

  @IsOptional()
  @IsIn([AssetType.IMAGE, AssetType.VIDEO])
  type?: AssetType;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @mediaUrl()
  posterUrl?: string;

  @IsOptional()
  @IsString()
  publicId?: string;

  @IsOptional()
  @IsIn(['cloudinary'])
  provider?: string;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  bytes?: number;
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
  @IsUrl({ require_protocol: true, protocols: ['https', 'http'] })
  githubUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl({ require_protocol: true, protocols: ['https', 'http'] })
  liveUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @mediaUrl()
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

  @IsOptional()
  @IsBoolean()
  showOnHomepage?: boolean;

  @IsOptional()
  @IsBoolean()
  showOnProjectsPage?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  homepageOrder?: number;

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

export class UpdateProjectDto extends PartialType(ProjectDto) {}

export class ReorderProjectsDto {
  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(500)
  @IsString({ each: true })
  ids!: string[];
}
