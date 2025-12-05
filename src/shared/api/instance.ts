import { useAuthStore } from '@/features/auth/model/store';
import type { ApiPaths } from '@/shared/api/schema';
import { API_CONFIG } from '@/shared/config/api/config';
import createFetchClient from 'openapi-fetch';
import createClient from 'openapi-react-query';

export const fetchClient = createFetchClient<ApiPaths>({
  baseUrl: API_CONFIG.API_BASE_URL,
  credentials: 'include', // Send cookies with requests
});

export const rqClient = createClient(fetchClient);

export const publicFetchClient = createFetchClient<ApiPaths>({
  baseUrl: API_CONFIG.API_BASE_URL,
  credentials: 'include', // Send cookies with requests
});

export const publicRqClient = createClient(publicFetchClient);

fetchClient.use({
  onRequest({ request }) {
    const token = useAuthStore.getState().getAccessToken();

    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    } else {
      return new Response(
        JSON.stringify({
          code: 'NOT_AUTHORIZED',
          message: 'You are not authorized to access this resource',
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }
  },
});
