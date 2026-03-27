import { Controller, Get, Post, Query, Param, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@common/guards/auth.guard';
import { MaterialService } from './material.service';

@Controller('materials')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Get()
  async getList(
    @Query('keyword') keyword: string,
    @Query('type') type: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    return this.materialService.getList({ keyword, type, page, pageSize });
  }

  @Get(':id')
  async getDetail(@Param('id') id: number) {
    return this.materialService.getDetail(id);
  }

  @Post(':id/collect')
  @UseGuards(AuthGuard)
  async collect(@Param('id') id: number, @Request() req) {
    return this.materialService.collect(req.user.id, id);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() body: any, @Request() req) {
    return this.materialService.create(req.user.id, body);
  }
}
