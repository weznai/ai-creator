import { request } from './request';

export const workApi = {
  getMyWorks: () => request.get('/work/my'),
  getCollections: () => request.get('/work/collections'),
  removeCollection: (id: string) => request.delete(`/work/collections/${id}`),
};
