import type { Request, Response } from 'express';
import * as dashboardService from '../services/dashboard.service.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getSummary = async (req: Request, res: Response) => {
  try {
    const summary = await dashboardService.getDashboardSummary();
    return sendSuccess(res, { summary });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const getDailyCalls = async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const dailyCalls = await dashboardService.getDailyCalls(days);
    return sendSuccess(res, { dailyCalls });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const getTopContacts = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const topContacts = await dashboardService.getTopContacts(limit);
    return sendSuccess(res, { topContacts });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const wipeAllData = async (req: Request, res: Response) => {
  try {
    await dashboardService.wipeAllData();
    return sendSuccess(res, null, 'All data wiped successfully');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};
