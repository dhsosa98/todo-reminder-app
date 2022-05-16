import { IsString, MinLength } from 'class-validator';

export class UserDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(3)
  surname: string;

  @IsString()
  @MinLength(3)
  password: string;
}
