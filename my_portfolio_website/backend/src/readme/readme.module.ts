import { Module } from '@nestjs/common';
import { ReadmeController } from './readme.controller';
import { ReadmeSyncService } from './readme-sync.service';

@Module({
  controllers: [ReadmeController],
  providers: [ReadmeSyncService],
  exports: [ReadmeSyncService],
})
export class ReadmeModule {}
