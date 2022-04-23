import { IsBoolean, IsString } from 'class-validator';

export class TodoItemDto {
  @IsString()
  description: string;

  @IsBoolean()
  selected: boolean;
}
