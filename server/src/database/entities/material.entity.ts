import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('materials')
export class Material {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'material_type', type: 'varchar', length: 20 })
  @Index()
  materialType: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  title: string;

  @Column({ type: 'text' })
  prompt: string;

  @Column({ name: 'media_url', type: 'varchar', length: 500 })
  mediaUrl: string;

  @Column({ name: 'thumbnail_url', type: 'varchar', length: 500, nullable: true })
  thumbnailUrl: string;

  @Column({ name: 'ecommerce_work', type: 'varchar', length: 200, nullable: true })
  ecommerceWork: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Index()
  scene: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'int', nullable: true })
  width: number;

  @Column({ type: 'int', nullable: true })
  height: number;

  @Column({ name: 'file_size', type: 'bigint', nullable: true })
  fileSize: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  duration: number;

  @Column({ name: 'model_id', type: 'bigint', nullable: true })
  @Index()
  modelId: number;

  @Column({ name: 'model_name', type: 'varchar', length: 50, nullable: true })
  modelName: string;

  @Column({ name: 'view_count', type: 'int', default: 0 })
  viewCount: number;

  @Column({ name: 'collect_count', type: 'int', default: 0 })
  collectCount: number;

  @Column({ type: 'tinyint', default: 1 })
  @Index()
  status: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tags: string;

  @Column({ name: 'source_task_id', type: 'bigint', nullable: true })
  sourceTaskId: number;

  @CreateDateColumn({ name: 'created_at' })
  @Index()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
