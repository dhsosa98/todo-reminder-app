import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { DirectoryDto } from 'src/dtos/directory.dto';
import { Directory } from 'src/entities/directory.entity';
import { TodoItem } from 'src/entities/todoItem.entity';
import { TodoItemService } from './todoItem.service';

@Injectable()
export class DirectoryService {
  constructor(
    @Inject('DIRECTORY_REPOSITORY')
    private directoryRepository: typeof Directory,
    private todoitemsService: TodoItemService,
  ) {}

  async findAll(userId: number): Promise<Directory[]> {
    return this.directoryRepository.findAll({ where: { userId } });
  }

  async findOne(userId: number, id: number): Promise<Directory> {
    const directory = await this.directoryRepository.findOne({
      where: { [Op.and]: [{ id }, { userId }] },
    });
    if (!directory) {
      throw new NotFoundException(`Directory with id ${id} not found`);
    }
    return directory;
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
}
