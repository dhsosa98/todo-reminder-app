import { IsString, MinLength } from 'class-validator';
export class DirectoryDto {
  @IsString()
  @MinLength(3)
  name: string;
}
