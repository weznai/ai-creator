import { request } from './request';
import type { ImageTask, CreateImageTaskParams, VideoTask, CreateVideoTaskParams } from '@types/task';
import type { Model, SizeConfig, PageResult } from '@types/common';

export const taskApi = {
  getModels(type: 'image' | 'video') {
    return request.get<Model[]>('/models', { params: { type } });
  },

  getSizes(type: 'image' | 'video') {
    return request.get<SizeConfig[]>('/sizes', { params: { type } });
  },

  createImageTask(data: CreateImageTaskParams) {
    return request.post<{ taskId: number; taskNo: string }>('/image-tasks', data);
  },

  getImageTask(taskId: number) {
    return request.get<ImageTask>(`/image-tasks/${taskId}`);
  },

  getImageTaskList(params: { page: number; pageSize: number }) {
    return request.get<PageResult<ImageTask>>('/image-tasks', { params });
  },

  createVideoTask(data: CreateVideoTaskParams) {
    return request.post<{ taskId: number; taskNo: string }>('/video-tasks', data);
  },

  getVideoTask(taskId: number) {
    return request.get<VideoTask>(`/video-tasks/${taskId}`);
  },

  getVideoTaskList(params: { page: number; pageSize: number }) {
    return request.get<PageResult<VideoTask>>('/video-tasks', { params });
  },
};
