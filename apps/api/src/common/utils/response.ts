import { Response } from "express";

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    totalRecords?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrevious?: boolean;
    [key: string]: unknown;
  };
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  payload: ApiResponse<T>,
): Response => {
  return res.status(statusCode).json({
    success: payload.success,
    message: payload.message,
    data: payload.data ?? null,
    meta: payload.meta ?? null,
  });
};
