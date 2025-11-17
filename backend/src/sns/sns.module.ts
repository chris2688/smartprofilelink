import { Module } from '@nestjs/common';
import { SnsController } from './sns.controller';
import { SnsService } from './sns.service';
import { InstagramService } from './services/instagram.service';
import { YoutubeService } from './services/youtube.service';
import { TiktokService } from './services/tiktok.service';

@Module({
  controllers: [SnsController],
  providers: [SnsService, InstagramService, YoutubeService, TiktokService],
  exports: [SnsService],
})
export class SnsModule {}



