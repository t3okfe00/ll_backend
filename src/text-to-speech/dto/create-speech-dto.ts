import { IsString } from 'class-validator';

export class CreateTtsDto {
  @IsString()
  readonly text: string;
}
