import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

const DEFAULT_SETTINGS_ID = 'default_site_settings';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await this.prisma.siteSettings.create({
        data: {
          id: DEFAULT_SETTINGS_ID,
          defaultTheme: 'jarvis',
          contactFormEnabled: true,
          projectRequestsEnabled: true,
        },
      });
    }
    return settings;
  }

  async getPublicSettings() {
    const settings = await this.getSettings();
    return {
      defaultTheme: settings.defaultTheme,
      contactFormEnabled: settings.contactFormEnabled,
      projectRequestsEnabled: settings.projectRequestsEnabled,
    };
  }

  async updateSettings(dto: UpdateSettingsDto) {
    const existing = await this.getSettings();
    return this.prisma.siteSettings.update({
      where: { id: existing.id },
      data: dto,
    });
  }
}
