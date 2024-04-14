import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Op } from 'sequelize';
import { TodoItemDto, UpdateToDoItemOrderDto } from 'src/dtos/todoItem.dto';
import { Notification } from 'src/entities/notification.entity';
import { TodoItem } from 'src/entities/todoItem.entity';

@Injectable()
export class TodoItemService {
  constructor(
    @Inject('TODOITEM_REPOSITORY')
    private todoItemRepository: typeof TodoItem,
    @Inject('NOTIFICATION_REPOSITORY')
    private notificationRepository: typeof Notification,
    private eventEmitter: EventEmitter2,
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
      order: [['order', 'ASC']],
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

  async updateOrder(userId: number, todoItems: UpdateToDoItemOrderDto[]): Promise<TodoItem[]> {
    const promises = todoItems.map(async (todoItem) => {
      const { id, order } = todoItem;
      if (order===undefined || !id){
        throw new BadRequestException('Invalid order or id');
      }

      const result = await this.todoItemRepository.findOne<TodoItem>({
        where: { [Op.and]: [{ id }, { userId }] },
      });

      if (!result) {
        throw new NotFoundException(`TodoItem with id ${id} not found`);
      }
      result.order = order;
      await result.save();
      return result;
    });
    return Promise.all(promises);
  }

  async findOne(userId: number, id: number): Promise<TodoItem> {
    const result = await this.todoItemRepository.findOne<TodoItem>({
      where: { [Op.and]: [{ id }, { userId }] },
    });    
    if (!result) {
      throw new NotFoundException(`TodoItem with id ${id} not found`);
    }

    const dbNotification = await this.notificationRepository.findAll<Notification>({
      where: { taskId: id },
      attributes: ['active', 'provider', 'schedule'],
    });

    result.notification = {
      active: dbNotification[0]?.active || false,
      providers: dbNotification.map((notification) => notification.provider),
      schedule: dbNotification[0]?.schedule || '',
    }

    return result;
  }

  async create(userId: number, todoItem: TodoItemDto): Promise<TodoItem> {
    const {directoryId, ...rest} = todoItem;
    const newTodoItem = new TodoItem({ userId, directoryId: directoryId || null, ...rest }, );
    await newTodoItem.save();
    this.eventEmitter.emit('task.created', newTodoItem);
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
    this.eventEmitter.emit('task.deleted', todoItem);
    return todoItem;
  }

  async update(
    userId: number,
    id: number,
    todoItem: TodoItemDto,
  ): Promise<TodoItem> {
    console.log('update', todoItem);
    // const { description, selected, notification } = todoItem;
    const result = await this.todoItemRepository.findOne<TodoItem>({
      where: { [Op.and]: [{ id }, { userId }] },
    });
    if (!result) {
      throw new NotFoundException(`TodoItem with id ${id} not found`);
    }
    const { directoryId, notification, ...rest } = todoItem;
    result.update({ userId, directoryId: directoryId || null, ...rest });
    await result.save();
    this.eventEmitter.emit('task.updated', todoItem);
    return result;
  }
}
