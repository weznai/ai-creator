export interface Material {
  id: number;
  materialType: 'image' | 'video';
  title: string;
  prompt: string;
  mediaUrl: string;
  thumbnailUrl: string;
  ecommerceWork: string;
  scene: string;
  address: string;
  viewCount: number;
  collectCount: number;
  createdAt: string;
}

export interface MaterialListParams {
  keyword?: string;
  type?: 'image' | 'video';
  page?: number;
  pageSize?: number;
}
