import type { Request, Response } from 'express';
import { Device } from '../models/Device.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { getPagination, formatPaginatedResponse } from '../utils/pagination.js';

export const getDevices = async (req: Request, res: Response) => {
  try {
    const { page, limit, skip } = getPagination(req);
    
    const [devices, total] = await Promise.all([
      Device.find().sort({ lastSeenAt: -1 }).skip(skip).limit(limit),
      Device.countDocuments()
    ]);
    
    return sendSuccess(res, formatPaginatedResponse(devices, total, page, limit));
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const getDeviceById = async (req: Request, res: Response) => {
  try {
    const device = await Device.findOne({ deviceId: req.params.id as string });
    if (!device) return sendError(res, 'Device not found', 404);
    
    return sendSuccess(res, { device });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};
