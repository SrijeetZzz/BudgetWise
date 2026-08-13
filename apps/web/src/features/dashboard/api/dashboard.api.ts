
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

import type {
  DashboardAnalytics,
  DashboardData,
  DashboardQuery,
} from '@/types/dashboard.types';

export const dashboardApi = {
  getDashboard: async (
    query?: DashboardQuery,
  ): Promise<DashboardData> => {
    const response = await apiClient.get(
      API_ENDPOINTS.DASHBOARD.BASE,
      {
        params: query,
      },
    );

    return response.data.data;
  },

  getDashboardAnalytics: async (
    query?: DashboardQuery,
  ): Promise<DashboardAnalytics> => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.DASHBOARD.BASE}/analytics`,
      {
        params: query,
      },
    );

    return response.data.data;
  },
};