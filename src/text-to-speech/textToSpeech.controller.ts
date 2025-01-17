import { create } from 'domain';
import { Controller, Body, Post } from '@nestjs/common';
import { TextToSpeechService } from './textToSpeech.service';
import { CreateTtsDto } from './dto/create-speech-dto';
@Controller('text-to-speech')
export class TextToSpeechController {
  constructor(private readonly textToSpeechService: TextToSpeechService) {}

  @Post()
  async generateSpeech(@Body() createTtsDto: CreateTtsDto) {
    let { text } = createTtsDto;
    const textToSpeechLink =
      await this.textToSpeechService.processTextToSpeech(text);
    return {
      success: true,
      url: textToSpeechLink,
      message: 'Audio generated successfully',
    };
  }
}
