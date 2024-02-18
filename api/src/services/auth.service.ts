import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/dtos/user.dto';
import { UsersService } from './user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      return null;
    }
    const isValid = await bcrypt.compare(pass, user?.password);
    if (isValid) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.dataValues.username,
      sub: user.dataValues.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: UserDto) {
    return await this.usersService.create(user);
  }
}
