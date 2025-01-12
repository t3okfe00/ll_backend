import { Module } from '@nestjs/common';
import { StoriesController } from './stories.controller';
import { OpenAIService } from './stories.service';
@Module({
  controllers: [StoriesController],
  providers: [OpenAIService],
})
export class StoriesModule {}
