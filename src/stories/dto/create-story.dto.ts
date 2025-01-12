import { IsString } from 'class-validator';

export class CreateStoryDto {
  @IsString()
  readonly translateTo: string;
  @IsString()
  readonly prompt: string;
}
