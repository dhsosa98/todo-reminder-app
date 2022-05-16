import { Module } from '@nestjs/common';
import { TodoItemService } from 'src/services/todoItem.service';
import { TodoItemProvider } from 'src/providers/todoItem.provider';
import { TodoItemController } from 'src/controllers/todoItem.controller';
import { DatabaseModule } from './db.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TodoItemController],
  providers: [TodoItemService, ...TodoItemProvider],
  exports: [TodoItemService],
})
export class todoItemModule {}
