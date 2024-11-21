import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import axios from 'axios';

import { api } from '@/modules/api/api';

import type { IAuthResponse } from './types';

interface LoginCredentials {
   username: string;
   email?: string;
   password: string;
}

const login = async (credentials: LoginCredentials): Promise<IAuthResponse> => {
   const response = await api.post<IAuthResponse>('/auth/login/', credentials);
   if (response.status >= 400) {
      throw new Error('Ошибка авторизации');
   }
   localStorage.setItem('token', response.data.access); // Сохраняем токен
   return response.data;
};

export const useLogin = () => {
   return useMutation<IAuthResponse, AxiosError, LoginCredentials>({
      mutationFn: login,
      onSuccess: (data) => {
         console.log('Успешный вход в систему', data);
      },
      onError: (error) => {
         console.error('Ошибка при входе в систему:', error.message);
      },
   });
};
