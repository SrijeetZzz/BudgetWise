import { Request, Response } from "express";
import { Types } from "mongoose";

import { asyncHandler } from "../../../common/helpers/asyncHandler";
import { sendResponse } from "../../../common/utils/response";

import { dashboardService } from "../services/dashboard.service";
import { DashboardQueryDto } from "../dtos/dashboard-query.dto";

class DashboardController {
  getDashboard = asyncHandler(async (req: Request, res: Response) => {
    const dashboard = await dashboardService.getDashboard(
      new Types.ObjectId(req.user.userId),
      req.query as DashboardQueryDto,
    );

    return sendResponse(res, 200, {
      success: true,
      message: "Dashboard fetched successfully.",
      data: dashboard,
    });
  });
  getDashboardAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const analytics = await dashboardService.getDashboardAnalytics(
      new Types.ObjectId(req.user.userId),
      req.query as DashboardQueryDto,
    );

    return sendResponse(res, 200, {
      success: true,
      message: "Dashboard analytics fetched successfully.",
      data: analytics,
    });
  });
}

export default new DashboardController();
