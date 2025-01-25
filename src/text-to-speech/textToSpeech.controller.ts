import { create } from 'domain';
import {
  Controller,
  Body,
  Post,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { TextToSpeechService } from './textToSpeech.service';
import { CreateTtsDto } from './dto/create-speech-dto';
@Controller('text-to-speech')
export class TextToSpeechController {
  constructor(private readonly textToSpeechService: TextToSpeechService) {}

  @Post()
  async generateSpeech(@Body() createTtsDto: CreateTtsDto) {
    console.log('Request?');
    let { text } = createTtsDto;
    try {
      const textToSpeechLink =
        await this.textToSpeechService.processTextToSpeech(text);
      return {
        success: true,
        url: textToSpeechLink,
        message: 'Audio generated successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Failed to generate audio',
      );
    }
  }
}
