import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import { authToken } from "../auth";

export function setupInterceptors(
  api: AxiosInstance,
) {
  api.interceptors.request.use(
    async (
      config: InternalAxiosRequestConfig,
    ) => {
      const token = await authToken.get();

      if (token) {
        config.headers.Authorization =
          `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );
}