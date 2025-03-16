import { Module } from '@nestjs/common';
import { StoriesController } from './stories.controller';
import { OpenAIService } from './stories.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SupabaseModule } from 'src/supabase/supabase.module';
@Module({
  imports: [SupabaseModule],
  controllers: [StoriesController],
  providers: [OpenAIService],
})
export class StoriesModule {}
