import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ReadmeModule } from '../readme/readme.module';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  imports: [AuthModule, ReadmeModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
