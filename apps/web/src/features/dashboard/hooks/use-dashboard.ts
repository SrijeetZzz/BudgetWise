'use client';

import { useQuery } from '@tanstack/react-query';



import type { DashboardQuery } from '@/types/dashboard.types';
import { dashboardApi } from '../api/dashboard.api';

export function useDashboard(query?: DashboardQuery) {
  return useQuery({
    queryKey: ['dashboard', query],
    queryFn: () => dashboardApi.getDashboard(query),
  });
}