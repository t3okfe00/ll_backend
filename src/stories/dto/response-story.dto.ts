import { IsString } from 'class-validator';

export class ResponseStoryDto {
  @IsString()
  readonly englishStory: string;

  @IsString()
  readonly translatedStory: string;

  readonly tokenUsed: Number;
}
