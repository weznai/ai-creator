import { request } from './request';
import {
  LoginParams,
  RegisterParams,
  SendCodeParams,
  LoginResult,
  User,
} from '@/types';

export const authApi = {
  sendCode(data: SendCodeParams) {
    return request.post<{ expireIn: number }>('/auth/send-code', data);
  },

  register(data: RegisterParams) {
    return request.post<LoginResult>('/auth/register', data);
  },

  login(data: LoginParams) {
    return request.post<LoginResult>('/auth/login', data);
  },

  logout() {
    return request.post('/auth/logout');
  },
};

export const userApi = {
  getProfile() {
    return request.get<User>('/user/profile');
  },

  updateProfile(data: { nickname?: string; avatar?: string }) {
    return request.put<User>('/user/profile', data);
  },

  updatePassword(data: { oldPassword: string; newPassword: string }) {
    return request.put<{ success: boolean }>('/user/password', data);
  },
};
