import { Module } from '@nestjs/common';
import { UserProvider } from 'src/providers/user.provider';
import { UsersService } from 'src/services/user.service';
import { DatabaseModule } from './db.module';

@Module({
imports: [DatabaseModule],
  providers: [UsersService, ...UserProvider],
  exports: [UsersService],
})
export class UsersModule {}