import {
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CollectDto {
  @IsString()
  @MaxLength(64)
  visitorId!: string;

  @IsString()
  @MaxLength(64)
  sessionKey!: string;

  @IsIn(['pageview', 'event', 'ping'])
  kind!: 'pageview' | 'event' | 'ping';

  @IsOptional()
  @IsString()
  @MaxLength(512)
  path?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  referrer?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  utmSource?: string;

  /** Event type for kind=event, e.g. github_click, resume_download, contact_submit. */
  @IsOptional()
  @IsString()
  @MaxLength(64)
  type?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  scrollDepth?: number;

  /** Seconds spent on the page, reported by the leave beacon. */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(60 * 60 * 12)
  duration?: number;
}
