import { SupabaseModule } from 'src/supabase/supabase.module';
import { TextToSpeechController } from './textToSpeech.controller';
import { TextToSpeechService } from './textToSpeech.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [SupabaseModule],
  controllers: [TextToSpeechController],
  providers: [TextToSpeechService],
})
export class TextToSpeechModule {}
