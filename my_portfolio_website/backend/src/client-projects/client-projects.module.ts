import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ClientProjectsController } from './client-projects.controller';
import { ClientProjectsService } from './client-projects.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClientProjectsController],
  providers: [ClientProjectsService],
  exports: [ClientProjectsService],
})
export class ClientProjectsModule {}
