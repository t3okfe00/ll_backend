import { Controller, Body, Post } from '@nestjs/common';
import { TextToSpeechService } from './textToSpeech.service';
@Controller('text-to-speech')
export class TextToSpeechController {
  constructor(private readonly textToSpeechService: TextToSpeechService) {}

  @Post()
  async generateSpeech(@Body() param: any) {
    console.log('Request for the Text to Speech', param);
    const code = this.textToSpeechService.createSpeech('Merhaba Nasılsın');
    return code;
  }
}
