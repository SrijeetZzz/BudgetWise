export const DASHBOARD_CACHE_TTL = 60; // 1 minute

export const getDashboardCacheKey = (
  userId: string,
  filter?: string,
) => {
  return `dashboard:${userId}:${filter ?? "THIS_MONTH"}`;
};

export const getDashboardAnalyticsCacheKey = (
  userId: string,
  filter?: string,
) => {
  return `dashboard:analytics:${userId}:${filter ?? "THIS_MONTH"}`;
};