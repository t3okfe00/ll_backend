import { Controller, Body, Post, UseGuards, Req } from '@nestjs/common';
import { TextToSpeechService } from './textToSpeech.service';
import { CreateTtsDto } from './dto/create-speech-dto';
import { AuthGuard } from 'src/auth/auth.guard';
@Controller('text-to-speech')
export class TextToSpeechController {
  constructor(private readonly textToSpeechService: TextToSpeechService) {}

  @UseGuards(AuthGuard)
  @Post()
  async generateSpeech(@Req() req, @Body() createTtsDto: CreateTtsDto) {
    const { userId, email } = req.user;
    let { text } = createTtsDto;
    try {
      const [remaining_daily_tts, textToSpeechLink] =
        await this.textToSpeechService.processTextToSpeech(userId, email, text);
      return {
        success: true,
        url: textToSpeechLink,
        remaining_daily_tts,
        message: 'Audio generated successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
