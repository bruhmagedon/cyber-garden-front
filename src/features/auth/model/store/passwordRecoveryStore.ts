import { create } from 'zustand';

interface PasswordRecoveryState {
  email: string;
  token: string;
  setEmail: (email: string) => void;
  setToken: (token: string) => void;
  clearData: () => void;
}

/**
 * Store для хранения email и токена в процессе восстановления пароля
 * Используется для передачи данных между формами восстановления пароля
 */
export const usePasswordRecoveryStore = create<PasswordRecoveryState>((set) => ({
  email: '',
  token: '',
  setEmail: (email: string) => set({ email }),
  setToken: (token: string) => set({ token }),
  clearData: () => set({ email: '', token: '' }),
}));
