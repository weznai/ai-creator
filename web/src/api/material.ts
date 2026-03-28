import { request } from './request';
import type { Material, MaterialListParams } from '@types/material';
import type { PageResult } from '@types/common';

export const materialApi = {
  getList(params: MaterialListParams) {
    return request.get<PageResult<Material>>('/materials', { params });
  },

  getDetail(id: number) {
    return request.get<Material>(`/materials/${id}`);
  },

  collect(id: number) {
    return request.post(`/materials/${id}/collect`);
  },

  cancelCollect(id: number) {
    return request.delete(`/materials/${id}/collect`);
  },
};
