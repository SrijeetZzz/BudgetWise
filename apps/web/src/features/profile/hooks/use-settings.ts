'use client';

import { useQuery } from '@tanstack/react-query';

import { profileApi } from '../api/profile.api';

export function useSettings() {
  return useQuery({
    queryKey: ['profile', 'settings'],
    queryFn: profileApi.getSettings,
  });
}