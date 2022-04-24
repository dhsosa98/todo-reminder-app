import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DirectoryModule } from './modules/directory.module';
import { todoItemModule } from './modules/todoItem.module';

@Module({
  imports: [ConfigModule.forRoot(), todoItemModule, DirectoryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
