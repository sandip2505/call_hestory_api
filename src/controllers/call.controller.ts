import type { Request, Response } from 'express';
import { syncCallsSchema } from '../validators/call.validator.js';
import * as callService from '../services/call.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { getPagination, formatPaginatedResponse } from '../utils/pagination.js';
import { Call } from '../models/Call.js';

export const syncCalls = async (req: Request, res: Response) => {
  try {
    const validatedData = syncCallsSchema.parse(req.body);
    const result = await callService.syncCalls(validatedData.device, validatedData.calls);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return sendError(res, 'Validation Error: ' + JSON.stringify(error.errors), 400);
    }
    return sendError(res, error.message, 500);
  }
};

export const getCalls = async (req: Request, res: Response) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const { calls, total } = await callService.getCalls(req.query, skip, limit);
    
    const transformedCalls = calls.map((c: any) => {
      const json = c.toJSON();
      json.id = json._id;
      json.timestamp = new Date(json.timestamp).getTime();
      delete json._id;
      delete json.__v;
      return json;
    });

    return res.status(200).json(formatPaginatedResponse(transformedCalls, total, page, limit));
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const getCallById = async (req: Request, res: Response) => {
  try {
    const call = await Call.findById(req.params.id).populate('recordingId');
    if (!call) return sendError(res, 'Call not found', 404);
    
    return sendSuccess(res, { call });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const deleteCall = async (req: Request, res: Response) => {
  try {
    const call = await Call.findById(req.params.id);
    if (!call) return sendError(res, 'Call not found', 404);

    if (call.recordingAvailable && call.recordingId) {
      // Logic to delete recording could also go here, or handled via webhook/event
    }

    await Call.findByIdAndDelete(req.params.id);
    return sendSuccess(res, null, 'Call deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};
