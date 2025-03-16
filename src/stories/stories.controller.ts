import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateStoryDto } from './dto/create-story.dto';
import { OpenAIService } from './stories.service';

//@UseGuards(AuthGuard)
@Controller('story')
export class StoriesController {
  constructor(private readonly openAIService: OpenAIService) {}

  @UseGuards(AuthGuard)
  @Post()
  async generateStory(@Req() req, @Body() createStoryDto: CreateStoryDto) {
    const userId = req.user.userId;
    const { prompt, translateTo } = createStoryDto;

    try {
      return await this.openAIService.generateStory(
        userId,
        prompt,
        translateTo,
      );
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An unexpected error occurred while generating the story',
      );
    }
  }
}
