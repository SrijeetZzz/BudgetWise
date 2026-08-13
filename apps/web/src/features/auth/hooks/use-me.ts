"use client";

import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

import { authApi } from "../api/auth.api";

import { authToken } from "@/lib/api/auth";
import { useAuthStore } from "@/store/auth.store";

export function useMe() {
  const setUser = useAuthStore(
    (state) => state.setUser,
  );

  const setLoading = useAuthStore(
    (state) => state.setLoading,
  );

  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.me,
    enabled: authToken.isAuthenticated(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setUser(query.data);
      setLoading(false);
    }

    if (query.isError) {
      setUser(null);
      setLoading(false);
    }
  }, [
    query.isSuccess,
    query.isError,
    query.data,
    setUser,
    setLoading,
  ]);

  return query;
}