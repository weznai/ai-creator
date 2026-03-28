import { defineStore } from 'pinia';
import type { User } from '@types/user';

interface UserState {
  token: string | null;
  user: User | null;
  isLogin: boolean;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    isLogin: !!localStorage.getItem('token'),
  }),

  getters: {
    nickname: (state) => state.user?.nickname || state.user?.userNo || '',
    avatar: (state) => state.user?.avatar || '',
  },

  actions: {
    setToken(token: string) {
      this.token = token;
      this.isLogin = true;
      localStorage.setItem('token', token);
    },

    setUser(user: User) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },

    updateUser(partial: Partial<User>) {
      if (this.user) {
        Object.assign(this.user, partial);
        localStorage.setItem('user', JSON.stringify(this.user));
      }
    },

    login(token: string, user: User) {
      this.setToken(token);
      this.setUser(user);
    },

    logout() {
      this.token = null;
      this.user = null;
      this.isLogin = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});
