import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@common/guards/auth.guard';
import { ImageTaskService } from './image-task.service';

@Controller('image-tasks')
@UseGuards(AuthGuard)
export class ImageTaskController {
  constructor(private readonly imageTaskService: ImageTaskService) {}

  @Post()
  async create(@Body() body: any, @Request() req) {
    return this.imageTaskService.create(req.user.id, body);
  }

  @Get(':id')
  async getStatus(@Param('id') id: number, @Request() req) {
    return this.imageTaskService.getStatus(req.user.id, id);
  }

  @Get()
  async getList(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
    @Request() req,
  ) {
    return this.imageTaskService.getList(req.user.id, { page, pageSize });
  }
}
