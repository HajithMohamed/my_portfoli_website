import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateSettingsDto {
  @ApiPropertyOptional({ example: 'jarvis' })
  @IsOptional()
  @IsString()
  defaultTheme?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  contactFormEnabled?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  projectRequestsEnabled?: boolean;

  @ApiPropertyOptional({ example: 'admin@hzlabs.studio' })
  @IsOptional()
  @IsEmail()
  notificationEmail?: string;
}
