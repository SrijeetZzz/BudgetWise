'use client';

import { useQuery } from '@tanstack/react-query';

import { profileApi } from '../api/profile.api';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],

    queryFn: profileApi.getProfile,
  });
}