import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AuthUser } from '../types';

interface AuthState {
  access_token: string | null;
  user: AuthUser | null;
  setAccessToken: (token: string) => void;
  setUser: (user: AuthUser | null) => void;
  clearTokens: () => void;
  isAuthenticated: () => boolean;
  getAccessToken: () => string | null;
  getUser: () => AuthUser | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      access_token: null,
      user: null,
      setAccessToken: (token) => {
        set({ access_token: token });
      },
      setUser: (user) => {
        set({ user });
      },
      clearTokens: () => {
        set({ access_token: null, user: null });
      },
      isAuthenticated: () => {
        return !!get().access_token;
      },
      getAccessToken: () => {
        return get().access_token;
      },
      getUser: () => {
        return get().user;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
