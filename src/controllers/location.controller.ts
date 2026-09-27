import type { Request, Response } from 'express';
import { syncLocationsSchema } from '../validators/location.validator.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { getPagination, formatPaginatedResponse } from '../utils/pagination.js';
import * as locationService from '../services/location.service.js';

export const syncLocations = async (req: Request, res: Response) => {
  try {
    const validatedData = syncLocationsSchema.parse(req.body);
    const result = await locationService.syncLocations(
      validatedData.deviceId,
      validatedData.locations
    );

    return sendSuccess(res, result, 'Locations synced successfully');
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return sendError(res, 'Validation error', 400);
    }
    console.error('Error syncing locations:', error);
    return sendError(res, 'Failed to sync locations', 500);
  }
};

export const getCurrentLocation = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.query;
    if (!deviceId || typeof deviceId !== 'string') {
      return sendError(res, 'deviceId is required', 400);
    }

    const location = await locationService.getCurrentLocation(deviceId);
    if (!location) {
      return sendError(res, 'No location found for this device', 404);
    }

    return sendSuccess(res, { location });
  } catch (error: any) {
    console.error('Error getting current location:', error);
    return sendError(res, 'Failed to get current location', 500);
  }
};

export const getHistory = async (req: Request, res: Response) => {
  try {
    const { deviceId, from, to } = req.query;
    if (!deviceId || typeof deviceId !== 'string') {
      return sendError(res, 'deviceId is required', 400);
    }

    const fromDate = from ? new Date(from as string) : undefined;
    const toDate = to ? new Date(to as string) : undefined;
    
    const { skip, limit, page } = getPagination(req);

    const { total, data } = await locationService.getLocationHistory(
      deviceId,
      fromDate,
      toDate,
      skip,
      limit
    );

    const responseData = formatPaginatedResponse(data, total, page, limit);
    return sendSuccess(res, responseData);
  } catch (error: any) {
    console.error('Error getting location history:', error);
    return sendError(res, 'Failed to get location history', 500);
  }
};

export const getTimeline = async (req: Request, res: Response) => {
  try {
    const { deviceId, date } = req.query;
    if (!deviceId || typeof deviceId !== 'string') {
      return sendError(res, 'deviceId is required', 400);
    }
    
    // Default to today if date is not provided
    const dateString = (date as string) || (new Date().toISOString().split('T')[0] as string);

    const visits = await locationService.getLocationTimeline(deviceId, dateString);
    return sendSuccess(res, { date: dateString, visits });
  } catch (error: any) {
    console.error('Error getting location timeline:', error);
    return sendError(res, 'Failed to get location timeline', 500);
  }
};
