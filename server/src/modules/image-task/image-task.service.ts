import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ImageTask } from '@database/entities/image-task.entity';

@Injectable()
export class ImageTaskService {
  constructor(
    @InjectRepository(ImageTask)
    private imageTaskRepository: Repository<ImageTask>,
  ) {}

  async create(userId: number, data: any) {
    // TODO: 实现创建图片生成任务逻辑
    // 1. 验证模型和尺寸配置
    // 2. 创建任务记录
    // 3. 推送到消息队列

    const task = this.imageTaskRepository.create({
      userId,
      taskNo: this.generateTaskNo(),
      taskType: data.taskType,
      modelId: data.modelId,
      modelName: data.modelName,
      prompt: data.prompt,
      negativePrompt: data.negativePrompt,
      referenceImage: data.referenceImage,
      width: data.width,
      height: data.height,
      generateCount: data.generateCount || 1,
      status: 0,
    });

    await this.imageTaskRepository.save(task);

    return {
      taskId: task.id,
      taskNo: task.taskNo,
      status: 'pending',
      estimatedTime: 30,
    };
  }

  async getStatus(userId: number, taskId: number) {
    const task = await this.imageTaskRepository.findOne({
      where: { id: taskId, userId },
    });

    if (!task) {
      return null;
    }

    return {
      taskId: task.id,
      taskNo: task.taskNo,
      status: this.getStatusText(task.status),
      taskType: task.taskType,
      prompt: task.prompt,
      modelName: task.modelName,
      resultImages: task.resultImages ? JSON.parse(task.resultImages) : [],
      createdAt: task.createdAt,
      completedAt: task.completedAt,
      costTime: task.costTime,
    };
  }

  async getList(
    userId: number,
    params: { page: number; pageSize: number },
  ) {
    const { page, pageSize } = params;

    const [list, total] = await this.imageTaskRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      list: list.map((task) => ({
        taskId: task.id,
        taskNo: task.taskNo,
        status: this.getStatusText(task.status),
        taskType: task.taskType,
        modelName: task.modelName,
        resultImages: task.resultImages ? JSON.parse(task.resultImages) : [],
        createdAt: task.createdAt,
      })),
      total,
      page,
      pageSize,
    };
  }

  private generateTaskNo(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `IMG${dateStr}${random}`;
  }

  private getStatusText(status: number): string {
    const statusMap = {
      0: 'pending',
      1: 'processing',
      2: 'success',
      3: 'failed',
    };
    return statusMap[status] || 'unknown';
  }
}
