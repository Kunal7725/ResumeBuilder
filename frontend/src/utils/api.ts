import axios from 'axios';
import { useResumeStore } from '../store/resumeStore';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = useResumeStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
