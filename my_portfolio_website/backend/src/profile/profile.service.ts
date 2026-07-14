import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile() {
    const profile = await this.prisma.profile.findFirst({
      include: { socialLinks: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'asc' },
    });

    if (profile) {
      return profile;
    }

    return this.prisma.profile.create({
      data: this.defaultProfile(),
      include: { socialLinks: true },
    });
  }

  async updateProfile(dto: UpdateProfileDto) {
    const profile = await this.getProfile();
    const { socialLinks, ...profileData } = dto;

    return this.prisma.profile.update({
      where: { id: profile.id },
      data: {
        ...profileData,
        ...(socialLinks
          ? {
              socialLinks: {
                deleteMany: {},
                create: socialLinks.map((link, order) => ({ ...link, order })),
              },
            }
          : {}),
      },
      include: { socialLinks: { orderBy: { order: 'asc' } } },
    });
  }

  private defaultProfile(): Prisma.ProfileCreateInput {
    return {
      name: 'Mohamed Hajith',
      title: 'Independent Software Engineer',
      tagline: 'Building Digital Products, Platforms, and Scalable Systems',
      bio: 'Full Stack Developer building modern web platforms, booking systems, authentication infrastructure, e-commerce solutions, and business automation software.',
      philosophy:
        'I enjoy building software that solves real operational problems. Whether it is a booking platform, authentication system, or commerce solution, I focus on scalability, maintainability, security, and user experience.',
      location: 'Sri Lanka',
      email: 'hello@hzlabs.dev',
      availabilityStatus:
        'Available for internships and software engineering opportunities',
      currentlyExploring: [
        'NestJS Architecture',
        'System Design',
        'Docker',
        'Data Science',
        'AI Integration',
      ],
      timeline: [
        { label: 'Education', value: 'Computer Science undergraduate' },
        {
          label: 'Projects',
          value: 'Commerce, booking, authentication, and admin platforms',
        },
      ],
      socialLinks: {
        create: [
          {
            label: 'GitHub',
            url: 'https://github.com/HajithMohamed',
            icon: 'github',
            order: 1,
          },
          {
            label: 'LinkedIn',
            url: 'https://www.linkedin.com/',
            icon: 'linkedin',
            order: 2,
          },
        ],
      },
    };
  }
}
