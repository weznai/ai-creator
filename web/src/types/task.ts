export interface ImageTask {
  taskId: number;
  taskNo: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  taskType: 'text2img' | 'img2img';
  prompt: string;
  modelName: string;
  resultImages: string[];
  createdAt: string;
  completedAt?: string;
  costTime?: number;
}

export interface CreateImageTaskParams {
  taskType: 'text2img' | 'img2img';
  modelId: number;
  prompt: string;
  negativePrompt?: string;
  referenceImage?: string;
  sizeId: number;
  generateCount: number;
  language?: string;
}

export interface VideoTask {
  taskId: number;
  taskNo: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  generateType: string;
  duration: number;
  resultVideo?: string;
  createdAt: string;
}

export interface CreateVideoTaskParams {
  modelId: number;
  generateType: 'start_end_frame' | 'multi_frame' | 'image_reference' | 'image_video_mix';
  startFrame?: string;
  endFrame?: string;
  referenceImages?: string[];
  referenceVideo?: string;
  duration: number;
  sizeId: number;
}
