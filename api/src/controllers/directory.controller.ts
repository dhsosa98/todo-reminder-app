import {
  Get,
  Controller,
  Post,
  Delete,
  Put,
  Body,
  Param,
} from '@nestjs/common';
import { DirectoryDto } from 'src/dtos/directory.dto';
import { DirectoryService } from 'src/services/directory.service';

@Controller('directories')
export class DirectoryController {
  constructor(private directoriesService: DirectoryService) {}

  @Get()
  getDirectories() {
    return this.directoriesService.findAll();
  }

  @Get(':id')
  getDirectory(@Param('id') id: number) {
    return this.directoriesService.findOne(id);
  }

  @Delete(':id')
  deleteDirectory(@Param('id') id: number) {
    return this.directoriesService.delete(id);
  }

  @Post()
  createDirectory(@Body() directory: DirectoryDto) {
    return this.directoriesService.create(directory);
  }
}
