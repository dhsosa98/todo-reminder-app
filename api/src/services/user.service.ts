import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { UserDto } from 'src/dtos/user.dto';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
/* eslint-disable  */
require('dotenv').config();

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private usersRepository: typeof User,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(user: UserDto): Promise<User> {
    const { password, username } = user;
    const userDB = this.usersRepository.findOne({ where: { username } });
    if (userDB){
      throw new ConflictException('User already exists');
    }
    const newUser = new User({ ...user, password: await bcrypt.hash(password, Number(process.env.HASH_SALT) || 10) });
    await newUser.save();
    return newUser;
  }
}
