import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface UserState {
  token: string | null;
  user: User | null;
  isLogin: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLogin: false,
      
      setToken: (token) => set({ token, isLogin: !!token }),
      
      setUser: (user) => set({ user }),
      
      login: (token, user) => set({ token, user, isLogin: true }),
      
      logout: () => set({ token: null, user: null, isLogin: false }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);
