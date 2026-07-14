import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuthModule } from './auth/auth.module';
import { BlogsModule } from './blogs/blogs.module';
import { CertificatesModule } from './certificates/certificates.module';
import { GithubModule } from './github/github.module';
import { HealthController } from './health.controller';
import { MediaModule } from './media/media.module';
import { MessagesModule } from './messages/messages.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';
import { ProjectsModule } from './projects/projects.module';
import { ResumeModule } from './resume/resume.module';
import { SkillsModule } from './skills/skills.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    PrismaModule,
    AuthModule,
    ProfileModule,
    SkillsModule,
    ProjectsModule,
    BlogsModule,
    MessagesModule,
    ResumeModule,
    UploadsModule,
    GithubModule,
    AnalyticsModule,
    TestimonialsModule,
    CertificatesModule,
    MediaModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [HealthController],
})
export class AppModule {}
