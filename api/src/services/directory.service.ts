import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { DirectoryDto } from 'src/dtos/directory.dto';
import { Directory } from 'src/entities/directory.entity';
import { TodoItem } from 'src/entities/todoItem.entity';
import { TodoItemService } from './todoItem.service';
import { Notification } from 'src/entities/notification.entity';

@Injectable()
export class DirectoryService {
  constructor(
    @Inject('DIRECTORY_REPOSITORY')
    private directoryRepository: typeof Directory,
    @Inject('TODOITEM_REPOSITORY')
    private todoitemsRepository: typeof TodoItem,
    @Inject('NOTIFICATION_REPOSITORY')
    private notificationRepository: typeof Notification,
    private todoitemsService: TodoItemService,
  ) {}

  async findAll(userId: number): Promise<Directory[]> {
    return this.directoryRepository.findAll({ where: { [Op.and]: [{ userId }, {parentId: null}] } });
  }

  async getBaseDirectories(userId: number): Promise<Directory> {
    const directories = await this.directoryRepository.findAll({ 
      where: { [Op.and]: [{ userId }, {parentId: null}] }, 
    });
    const todoItems = await this.todoitemsRepository.findAll<TodoItem>({
      where: { userId, directoryId: null },
    });
    const directory: any = {};
    directory.id = null;
    directory.name = 'Home';
    directory.children = directories;
    directory.todoItem = todoItems;
    for await (const todoItem of todoItems) {
      const todoItemId = todoItem.id;
      const dbNotification = await this.notificationRepository.findAll<Notification>({
        where: { taskId: todoItemId },
        attributes: ['active', 'provider', 'schedule'],
      });
      if (dbNotification.length) {
        todoItem.setDataValue('notification', 
          {
            active: dbNotification[0]?.active || false,
            providers: dbNotification.map((notification) => notification.provider),
            schedule: dbNotification[0]?.schedule || '',
          });
      }
    }
    return directory as Directory;
  }

  async findOne(userId: number, id: number|null): Promise<Directory> {
    const directory = await this.directoryRepository.findOne({
      include: [Directory, {
        model: TodoItem,
        as: 'todoItem',
        order: [['order', 'ASC']],
        separate: true,
      }],
      where: { [Op.and]: [{ id }, { userId }] },
    });
    if (!directory) {
      throw new NotFoundException(`Directory with id ${id} not found`);
    }
    const todoItems = directory?.todoItem || [];
    for await (const todoItem of todoItems) {
      const todoItemId = todoItem.id;
      const dbNotification = await this.notificationRepository.findAll<Notification>({
        where: { taskId: todoItemId },
        attributes: ['active', 'provider', 'schedule'],
      });
      if (dbNotification.length) {
        todoItem.setDataValue('notification', 
          {
            active: dbNotification[0]?.active || false,
            providers: dbNotification.map((notification) => notification.provider),
            schedule: dbNotification[0]?.schedule || '',
          });
        }
    }
    directory.setDataValue('todoItem', todoItems);
    return directory;
  }

  async getTree(userId: number, id: number): Promise<any> {
    let directory = await this.directoryRepository.findOne({
      where: { [Op.and]: [{ id }, { userId }] },
    });
    if (!directory) {
      throw new NotFoundException(`Directory with id ${id} not found`);
    }
    let tree = [];
    tree.push(directory);
    while (true) {
      const parent = await this.directoryRepository.findOne({
        where: { id: directory.parentId },
      });
      if (!parent) {
        break;
      }
      tree.push(parent);
      directory = parent;
    }
    return tree.reverse();
  }

  async getFullTree(userId: number): Promise<Directory[]> {
    const directories = await this.directoryRepository.findAll({
      where: { userId },
    });
    const tree: Directory[] = [];
    for await (const directory of directories) {
      if (!directory.parentId) {
        directory.setDataValue('children', await this.buildTree(userId, directory.id));
        directory.setDataValue('todoItem', await this.todoitemsRepository.findAll<TodoItem>({
          where: { userId, directoryId: directory.id },
        }));
        tree.push(directory);
      }
    }
    return tree;
  }

  async buildTree(userId: number, parentId: number): Promise<Directory[]> {
    const directories = await this.directoryRepository.findAll({
      where: { [Op.and]: [{ userId }, { parentId }] },
      include: [
        {
          model: TodoItem,
          as: 'todoItem',
          order: [['order', 'ASC']],
          separate: true,
        },
      ],
    });
    for await (const directory of directories) {
      directory.setDataValue('children', await this.buildTree(userId, directory.id));
    }
    return directories;
  }

  async findAllTodoItems(
    userId: number,
    directoryId: number,
    search: string,
  ): Promise<TodoItem[]> {
    const result = await this.directoryRepository.findOne({
      where: { id: directoryId },
    });
    if (!result) {
      throw new NotFoundException(
        `Not found any To-do list with Directory ${directoryId} id`,
      );
    }
    return this.todoitemsService.findAllByRepositoryId(
      directoryId,
      userId,
      search,
    );
  }

  async delete(userId: number, id: number): Promise<Directory> {
    const directory = await this.directoryRepository.findOne({
      where: { [Op.and]: [{ id }, { userId }] },
    });
    if (!directory) {
      throw new NotFoundException(`Directory with id ${id} not found`);
    }
    await directory.destroy();
    return directory;
  }

  async create(userId: number, directory: DirectoryDto): Promise<Directory> {
    const newDirectory = new Directory({ userId, ...directory });
    await newDirectory.save();
    return newDirectory;
  }

  async update(userId: number, id: number, directory: DirectoryDto): Promise<Directory> {
    const updatedDirectory = await this.directoryRepository.findOne({
      where: { [Op.and]: [{ id }, { userId }] },
    });
    if (!updatedDirectory) {
      throw new NotFoundException(`Directory with id ${id} not found`);
    }
    updatedDirectory.update({...directory});
    await updatedDirectory.save();
    return updatedDirectory;
  }
}
