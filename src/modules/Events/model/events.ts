import type { UseQueryResult } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import axios from 'axios';

import { api } from '@/modules/api/api';

import type { Events } from './types';

const events = async (): Promise<Events> => {
   const response = await api.get<Events>('/events/event/', {
      headers: {
         Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
   });
   if (response.status >= 400) {
      throw new Error('Ошибка запроса данных');
   }
   // Сохраняем токен
   return response.data;
};

export const useFetchEventsList = (): UseQueryResult<Events, Error> => {
   return useQuery<Events, Error>({
      queryKey: ['events'],
      queryFn: events,
      placeholderData: (previousData) => previousData,
   });
};
