export interface User {
  id: number;
  userNo: string;
  phone: string;
  nickname: string;
  avatar: string;
  createdAt: string;
}

export interface LoginParams {
  phone: string;
  loginType: 'password' | 'code';
  password?: string;
  code?: string;
}

export interface RegisterParams {
  phone: string;
  code: string;
  nickname: string;
  password: string;
}

export interface SendCodeParams {
  phone: string;
  type: number;
}

export interface LoginResult {
  token: string;
  expiresIn: number;
  user: User;
}
