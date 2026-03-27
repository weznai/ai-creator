import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';

import { Material } from '@database/entities/material.entity';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material)
    private materialRepository: Repository<Material>,
  ) {}

  async getList(params: {
    keyword?: string;
    type?: string;
    page: number;
    pageSize: number;
  }) {
    const { keyword, type, page, pageSize } = params;

    const where: any = { status: 1 };

    if (type) {
      where.materialType = type;
    }

    const queryBuilder = this.materialRepository.createQueryBuilder('material');

    queryBuilder.where('material.status = :status', { status: 1 });

    if (type) {
      queryBuilder.andWhere('material.materialType = :type', { type });
    }

    if (keyword) {
      queryBuilder.andWhere('material.prompt LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    queryBuilder
      .orderBy('material.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [list, total] = await queryBuilder.getManyAndCount();

    return {
      list: list.map((item) => ({
        id: item.id,
        materialType: item.materialType,
        title: item.title,
        prompt: item.prompt,
        mediaUrl: item.mediaUrl,
        thumbnailUrl: item.thumbnailUrl,
        ecommerceWork: item.ecommerceWork,
        scene: item.scene,
        address: item.address,
        viewCount: item.viewCount,
        collectCount: item.collectCount,
        createdAt: item.createdAt,
      })),
      total,
      page,
      pageSize,
    };
  }

  async getDetail(id: number) {
    const material = await this.materialRepository.findOne({
      where: { id, status: 1 },
    });

    if (!material) {
      return null;
    }

    // 增加浏览次数
    await this.materialRepository.increment({ id }, 'viewCount', 1);

    return {
      id: material.id,
      materialType: material.materialType,
      title: material.title,
      prompt: material.prompt,
      mediaUrl: material.mediaUrl,
      thumbnailUrl: material.thumbnailUrl,
      ecommerceWork: material.ecommerceWork,
      scene: material.scene,
      address: material.address,
      width: material.width,
      height: material.height,
      duration: material.duration,
      modelName: material.modelName,
      viewCount: material.viewCount + 1,
      collectCount: material.collectCount,
      tags: material.tags,
      createdAt: material.createdAt,
    };
  }

  async collect(userId: number, materialId: number) {
    // TODO: 实现收藏逻辑
    return { success: true };
  }

  async create(userId: number, data: any) {
    // TODO: 实现创建逻辑
    return { success: true };
  }
}
