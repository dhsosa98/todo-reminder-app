import { Allow, IsBoolean, IsNumber, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { NotificationDto } from './notifcation.dto';
import { Type } from 'class-transformer';

export class TodoItemDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  description: string;

  @IsOptional()
  @IsBoolean()
  selected: boolean;

  @IsOptional()
  @IsNumber()
  directoryId: number;

  @IsOptional()
  @Allow()
  @ValidateNested()
  @Type(() => NotificationDto)
  notification?: NotificationDto|null;
}

export class UpdateToDoItemOrderDto extends TodoItemDto {
  @IsNumber()
  id: number;

  @IsNumber()
  order: number;
}