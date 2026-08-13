import { Types } from "mongoose";

import { cacheService } from "../../../common/services/cache.service";
import { DashboardFilter } from "../../../common/enums/dashboard-filter.enum";
import {
  getDashboardCacheKey,
  getDashboardAnalyticsCacheKey,
} from "../constants/dashboard-cache.constants";

const DASHBOARD_FILTERS = Object.values(DashboardFilter);

export const invalidateDashboardCache = async (
  userId: Types.ObjectId | string,
) => {
  const userIdString = userId.toString();

  const keys = DASHBOARD_FILTERS.flatMap((filter) => [
    getDashboardCacheKey(userIdString, filter),
    getDashboardAnalyticsCacheKey(userIdString, filter),
  ]);

  await cacheService.deleteMany(keys);
};