import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { OpenAIService } from './stories.service';
import { create } from 'domain';

@Controller('story')
export class StoriesController {
  constructor(private readonly openAIService: OpenAIService) {}

  @Post()
  async generateStory(@Body() createStoryDto: CreateStoryDto) {
    const { prompt, translateTo } = createStoryDto;
    let response = await this.openAIService.generateStory(prompt, translateTo);
    console.log('Response for the Request', response);
    return response;
  }
}
