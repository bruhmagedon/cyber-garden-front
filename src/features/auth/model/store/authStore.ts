import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  access_token: string | null;
  setAccessToken: (token: string) => void;
  clearTokens: () => void;
  isAuthenticated: () => boolean;
  getAccessToken: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      access_token: null,
      setAccessToken: (token) => {
        set({ access_token: token });
      },
      clearTokens: () => {
        set({ access_token: null });
      },
      isAuthenticated: () => {
        return !!get().access_token;
      },
      getAccessToken: () => {
        return get().access_token;
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);
