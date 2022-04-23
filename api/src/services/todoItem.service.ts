import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { TodoItemDto } from 'src/dtos/todoItem.dto';
import { TodoItem } from 'src/entities/todoItem.entity';

@Injectable()
export class TodoItemService {
  constructor(
    @Inject('TODOITEM_REPOSITORY')
    private todoItemRepository: typeof TodoItem,
  ) {}

  async findAll(): Promise<TodoItem[]> {
    return this.todoItemRepository.findAll<TodoItem>();
  }

  async findOne(id: number): Promise<TodoItem> {
    const result = await this.todoItemRepository.findOne<TodoItem>({
      where: { id },
    });
    if (!result) {
      throw new NotFoundException(`TodoItem with id ${id} not found`);
    }
    return result;
  }

  async create(todoItem: TodoItemDto): Promise<TodoItem> {
    const newTodoItem = new TodoItem({ ...todoItem });
    await newTodoItem.save();
    return newTodoItem;
  }

  async delete(id: number): Promise<number | any> {
    const todoItem = await this.todoItemRepository.findOne<TodoItem>({
      where: { id },
    });
    if (!todoItem) {
      throw new NotFoundException(`TodoItem with id ${id} not found`);
    }
    await todoItem.destroy();
    return todoItem;
  }

  async update(id: number, todoItem: TodoItemDto): Promise<TodoItem> {
    const { description, selected } = todoItem;
    const result = await this.todoItemRepository.findOne<TodoItem>({
      where: { id },
    });
    if (!result) {
      throw new NotFoundException(`TodoItem with id ${id} not found`);
    }
    result.description = description;
    result.selected = selected;
    await result.save();
    return result;
  }
}
