import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TodoItemController } from './controllers/todoItem.controller';
import { todoItemModule } from './modules/todoItem.module';
import { TodoItemProvider } from './providers/todoItem.provider';
import { TodoItemService } from './services/todoItem.service';

@Module({
  imports: [ConfigModule.forRoot(), todoItemModule],
  controllers: [TodoItemController],
  providers: [TodoItemService, ...TodoItemProvider],
})
export class AppModule {}
