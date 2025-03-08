import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateStoryDto } from './dto/create-story.dto';
import { OpenAIService } from './stories.service';

//@UseGuards(AuthGuard)
@Controller('story')
export class StoriesController {
  constructor(private readonly openAIService: OpenAIService) {}

  @Post()
  async generateStory(@Body() createStoryDto: CreateStoryDto) {
    const { prompt, translateTo } = createStoryDto;
    try {
      return await this.openAIService.generateStory(prompt, translateTo);
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while generating the story',
      );
    }
  }
}
