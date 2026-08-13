import axios from 'axios';

import { env } from '@/lib/env';
import { setupInterceptors } from './interceptors';

export const apiClient = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
  },
});

setupInterceptors(apiClient);