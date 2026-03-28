import { request } from './request';

export const userApi = {
  getProfile: () => request.get('/user/profile'),
  updateProfile: (data: any) => request.put('/user/profile', data),
};
