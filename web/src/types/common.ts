export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

export interface PageParams {
  page?: number;
  pageSize?: number;
}

export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SizeConfig {
  id: number;
  configType: 'image' | 'video';
  scene: string;
  method: string;
  ratio: string;
  width: number;
  height: number;
  duration?: number;
  description: string;
}

export interface Model {
  id: number;
  name: string;
  code: string;
  provider: string;
  capabilities: string[];
  description: string;
  useCases: string;
  icon: string;
}
