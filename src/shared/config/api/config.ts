export const API_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? 'https://7b39f387653f364f.mokky.dev',
};

export const getWebSocketUrl = () => {
  const baseUrl = API_CONFIG.API_BASE_URL;
  return baseUrl.replace(/^http/, 'ws');
};
