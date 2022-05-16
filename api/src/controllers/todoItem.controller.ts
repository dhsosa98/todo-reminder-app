import { TodoItemService } from 'src/services/todoItem.service';
import {
  Get,
  Controller,
  Post,
  Delete,
  Put,
  Body,
  Param,
  UseGuards,
  Request
} from '@nestjs/common';
import { TodoItemDto } from 'src/dtos/todoItem.dto';

@Controller('todoitems')
export class TodoItemController {
  constructor(private todoItemService: TodoItemService) {}

  @Get()
  getTodoItems(@Request() req) {
    return this.todoItemService.findAll(req.user.userId);
  }

  @Get('/:id')
  getTodoItem(@Request() req, @Param('id') id: number) {
    return this.todoItemService.findOne(req.user.userId, id);
  }

  @Post()
  createTodoItem(@Request() req, @Body() todoItem: TodoItemDto) {
    return this.todoItemService.create(req.user.userId, todoItem);
  }

  @Delete('/:id')
  deleteTodoItem(@Request() req, @Param('id') id: number) {
    return this.todoItemService.delete(req.user.userId, id);
  }

  @Put('/:id')
  updateTodoItem(@Request() req, @Param('id') id: number, @Body() todoItem: TodoItemDto) {
    return this.todoItemService.update(req.user.userId, id, todoItem);
  }
}
