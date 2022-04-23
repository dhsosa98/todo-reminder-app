import { IsBoolean, IsNumber, IsString, MinLength } from 'class-validator';

export class TodoItemDto {
  @IsString()
  @MinLength(3)
  description: string;

  @IsBoolean()
  selected: boolean;

  @IsNumber()
  directoryId: number;
}
