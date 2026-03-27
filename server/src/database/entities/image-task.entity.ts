import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('image_tasks')
export class ImageTask {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint' })
  @Index()
  userId: number;

  @Column({ name: 'task_no', type: 'varchar', length: 32, unique: true })
  taskNo: string;

  @Column({ name: 'task_type', type: 'varchar', length: 20 })
  taskType: string;

  @Column({ type: 'varchar', length: 20, default: 'zh' })
  language: string;

  @Column({ name: 'model_id', type: 'bigint' })
  modelId: number;

  @Column({ name: 'model_name', type: 'varchar', length: 50 })
  modelName: string;

  @Column({ type: 'text' })
  prompt: string;

  @Column({ name: 'negative_prompt', type: 'text', nullable: true })
  negativePrompt: string;

  @Column({ name: 'reference_image', type: 'varchar', length: 500, nullable: true })
  referenceImage: string;

  @Column({ name: 'size_id', type: 'bigint', nullable: true })
  sizeId: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  scene: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  method: string;

  @Column({ type: 'int' })
  width: number;

  @Column({ type: 'int' })
  height: number;

  @Column({ name: 'generate_count', type: 'tinyint', default: 1 })
  generateCount: number;

  @Column({ type: 'tinyint', default: 0 })
  @Index()
  status: number;

  @Column({ name: 'result_images', type: 'text', nullable: true })
  resultImages: string;

  @Column({ name: 'error_msg', type: 'varchar', length: 500, nullable: true })
  errorMsg: string;

  @Column({ name: 'cost_time', type: 'int', nullable: true })
  costTime: number;

  @CreateDateColumn({ name: 'created_at' })
  @Index()
  createdAt: Date;

  @Column({ name: 'started_at', type: 'datetime', nullable: true })
  startedAt: Date;

  @Column({ name: 'completed_at', type: 'datetime', nullable: true })
  completedAt: Date;
}
