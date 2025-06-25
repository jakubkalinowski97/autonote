import axios from 'axios';
import { storage } from './utils/storage';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Change to your backend URL if needed
});

api.interceptors.request.use(async (config) => {
  const jwt = await storage.getItem('jwt');
  if (jwt) config.headers.Authorization = `Bearer ${jwt}`;
  return config;
});

export default api; 