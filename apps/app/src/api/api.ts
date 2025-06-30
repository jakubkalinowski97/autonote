import axios from 'axios';
import { storage } from '../utils/storage';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Change to your backend URL if needed
});

api.interceptors.request.use(async (config) => {
  const access_token = await storage.getItem('access_token');
  if (access_token) config.headers.Authorization = `Bearer ${access_token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await storage.deleteItem('access_token');
      const refreshToken = storage.getItem('refresh_token');
      if (refreshToken) {
        const { data } = await axios.post('http://localhost:3000/api/auth/refresh-token', { refresh_token: refreshToken });
        storage.setItem('access_token', data.access_token);
        storage.setItem('refresh_token', data.refresh_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default api; 