import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ImageTaskController } from './image-task.controller';
import { ImageTaskService } from './image-task.service';
import { ImageTask } from '@database/entities/image-task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImageTask])],
  controllers: [ImageTaskController],
  providers: [ImageTaskService],
  exports: [ImageTaskService],
})
export class ImageTaskModule {}
