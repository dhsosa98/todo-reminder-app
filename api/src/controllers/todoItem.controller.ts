import { TodoItemService } from 'src/services/todoItem.service';
import {
  Get,
  Controller,
  Post,
  Delete,
  Put,
  Body,
  Param,
} from '@nestjs/common';
import { TodoItemDto } from 'src/dtos/todoItem.dto';

@Controller('todoitems')
export class TodoItemController {
  constructor(private todoItemService: TodoItemService) {}
  @Get()
  getTodoItems() {
    return this.todoItemService.findAll();
  }

  @Get('/:id')
  getTodoItem(@Param('id') id: number) {
    return this.todoItemService.findOne(id);
  }

  @Post()
  createTodoItem(@Body() todoItem: TodoItemDto) {
    console.log(todoItem);
    return this.todoItemService.create(todoItem);
  }

  @Delete('/:id')
  deleteTodoItem(@Param('id') id: number) {
    return this.todoItemService.delete(id);
  }

  @Put('/:id')
  updateTodoItem(@Param('id') id: number, @Body() todoItem: TodoItemDto) {
    return this.todoItemService.update(id, todoItem);
  }
}
