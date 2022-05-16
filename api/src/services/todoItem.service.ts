import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { TodoItemDto } from 'src/dtos/todoItem.dto';
import { TodoItem } from 'src/entities/todoItem.entity';

@Injectable()
export class TodoItemService {
  constructor(
    @Inject('TODOITEM_REPOSITORY')
    private todoItemRepository: typeof TodoItem,
  ) {}

  async findAll(userId: number): Promise<TodoItem[]> {
    return this.todoItemRepository.findAll<TodoItem>({ where: { userId } });
  }

  async findAllByRepositoryId(
    directoryId: number,
    userId: number,
    search: string,
  ): Promise<TodoItem[]> {
    const result = await this.todoItemRepository.findAll<TodoItem>({
      where: {
        [Op.and]: [
          { directoryId },
          { userId },
          search && { description: { [Op.like]: `%${search.trim()}%` } },
        ],
      },
    });
    return result;
  }

  async findOne(userId: number, id: number): Promise<TodoItem> {
    const result = await this.todoItemRepository.findOne<TodoItem>({
      where: { [Op.and]: [{ id }, { userId }] },
    });
    if (!result) {
      throw new NotFoundException(`TodoItem with id ${id} not found`);
    }
    return result;
  }

  async create(userId: number, todoItem: TodoItemDto): Promise<TodoItem> {
    const newTodoItem = new TodoItem({ userId, ...todoItem });
    await newTodoItem.save();
    return newTodoItem;
  }

  async delete(userId: number, id: number): Promise<number | any> {
    const todoItem = await this.todoItemRepository.findOne<TodoItem>({
      where: { [Op.and]: [{ id }, { userId }] },
    });
    if (!todoItem) {
      throw new NotFoundException(`TodoItem with id ${id} not found`);
    }
    await todoItem.destroy();
    return todoItem;
  }

  async update(
    userId: number,
    id: number,
    todoItem: TodoItemDto,
  ): Promise<TodoItem> {
    const { description, selected } = todoItem;
    const result = await this.todoItemRepository.findOne<TodoItem>({
      where: { [Op.and]: [{ id }, { userId }] },
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
