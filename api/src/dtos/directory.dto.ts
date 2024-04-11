import { IsOptional, IsString, MinLength } from 'class-validator';
export class DirectoryDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name: string;

  @IsOptional()
  parentId: number;
}
