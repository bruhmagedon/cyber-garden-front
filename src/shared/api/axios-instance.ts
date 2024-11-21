import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
// import * as decode from 'jwt-decode'; // Импортируем как модуль
// import { refreshTokenRequest } from './user/api/ui/refreshTokenRequest';

const api: AxiosInstance = axios.create({
   baseURL: 'http://5.42.82.220:8000/api',
   withCredentials: true,
});

// const onRequest = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
//    const token = localStorage.getItem('token');
//    if (token && !config.url?.includes('auth')) {
//       const decodedToken: { exp: number } = decode.jwtDecode(token); // Используем decode.default

//       const currentDate = new Date();
//       // console.log(decodedToken.exp * 1000 < currentDate.getTime())
//       // console.log(decodedToken.exp * 1000 )
//       // console.log(currentDate.getTime())
//       if (decodedToken.exp * 1000 - 518000 < currentDate.getTime()) {
//          const newToken = await refreshTokenRequest();
//          if (newToken) {
//             config.headers.set('Authorization', `Bearer ${newToken}`);
//          }
//       } else {
//          config.headers.set('Authorization', `Bearer ${token}`);
//       }
//    }
//    return config;
// };
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiI10NDRAZ21haWwuY29tIiwicm9sZXMiOlt7ImlkIjoxLCJjcmVhdGVkRGF0ZSI6IjIwMjQtMDktMjRUMDk6NDM6MjkuNjgxWiIsIm5hbWUiOiJVc2VyIn1dLCJpYXQiOjE3Mjk4ODQ0MjQsImV4cCI6MTcyOTg4NTMyNH0.1tMXoKa7h-NIuS9iTWXjOeP51t6608o72FYE3cEiWkE
const onResponse = (response: AxiosResponse): AxiosResponse => response;
const onResponseError = (error: AxiosError): Promise<AxiosError> => Promise.reject(error);

// api.interceptors.request.use(onRequest);
api.interceptors.response.use(onResponse, onResponseError);

export { api };
