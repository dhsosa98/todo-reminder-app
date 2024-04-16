import {
  Get,
  Controller,
  Post,
  Delete,
  Body,
  Param,
  Request,
  Query,
} from '@nestjs/common';
import { DirectoryDto } from 'src/dtos/directory.dto';
import { DirectoryService } from 'src/services/directory.service';

@Controller('directories')
export class DirectoryController {
  constructor(private directoriesService: DirectoryService) {}

  @Get()
  getDirectories(@Request() req) {
    const search = req.query.search as string;
    return this.directoriesService.findAll(req.user.userId, search);
  }

  @Get('search')
  getBySearchDirectories(@Request() req) {
    const search = req.query.q as string;
    return this.directoriesService.findByCriteria(req.user.userId, search);
  }

  @Get(':id/tree')
  getTree(@Request() req, @Param('id') id: number) {
    return this.directoriesService.getTree(req.user.userId, id);
  }

  @Get('/fullTree')
  getFullTree(@Request() req) {
    return this.directoriesService.getFullTree(req.user.userId);
  }

  
  @Get('/base')
  getBaseDirectories(@Request() req) {
    return this.directoriesService.getBaseDirectories(req.user.userId);
  }

  @Get(':id')
  getDirectory(@Request() req, @Param('id') id: number) {
    return this.directoriesService.findOne(req.user.userId, id);
  }

  @Get(':id/todoitems')
  getTodoItems(
    @Request() req,
    @Param('id') id: number,
    @Query('search') search: string,
  ) {
    return this.directoriesService.findAllTodoItems(req.user.userId, id, search);
  }

  @Delete(':id')
  deleteDirectory(@Request() req, @Param('id') id: number) {
    return this.directoriesService.delete(req.user.userId, id);
  }

  @Post()
  createDirectory(@Request() req, @Body() directory: DirectoryDto) {
    return this.directoriesService.create(req.user.userId, directory);
  }

  @Post(':id')
  updateDirectory(
    @Request() req,
    @Param('id') id: number,
    @Body() directory: DirectoryDto,
  ) {
    return this.directoriesService.update(req.user.userId, id, directory);
  }
}
