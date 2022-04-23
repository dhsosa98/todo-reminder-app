import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DirectoryDto } from 'src/dtos/directory.dto';
import { Directory } from 'src/entities/directory.entity';
import { TodoItem } from 'src/entities/todoItem.entity';

@Injectable()
export class DirectoryService {
  constructor(
    @Inject('DIRECTORY_REPOSITORY')
    private directoryRepository: typeof Directory,
  ) {}

  async findAll(): Promise<Directory[]> {
    return this.directoryRepository.findAll();
  }

  async findOne(id: number): Promise<Directory> {
    const directory = await this.directoryRepository.findOne({
      where: { id },
      include: [{ model: TodoItem }],
    });
    if (!directory) {
      throw new NotFoundException(`Directory with id ${id} not found`);
    }
    return directory;
  }

  async delete(id: number): Promise<Directory> {
    const directory = await this.directoryRepository.findOne({
      where: { id },
    });
    if (!directory) {
      throw new NotFoundException(`Directory with id ${id} not found`);
    }
    await directory.destroy();
    return directory;
  }

  async create(directory: DirectoryDto): Promise<Directory> {
    const newDirectory = new Directory({ ...directory });
    await newDirectory.save();
    return newDirectory;
  }
}
