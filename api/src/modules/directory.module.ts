import { Module } from '@nestjs/common';
import { DirectoryController } from 'src/controllers/directory.controller';
import { DirectoryProvider } from 'src/providers/directory.provider';
import { DirectoryService } from 'src/services/directory.service';
import { DatabaseModule } from './db.module';
import { todoItemModule } from './todoItem.module';

@Module({
  imports: [DatabaseModule, todoItemModule],
  controllers: [DirectoryController],
  providers: [DirectoryService, ...DirectoryProvider],
})
export class DirectoryModule {}
