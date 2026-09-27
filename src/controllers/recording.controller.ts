import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import * as recordingService from '../services/recording.service.js';
import { uploadRecordingSchema } from '../validators/recording.validator.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { getPagination, formatPaginatedResponse } from '../utils/pagination.js';
import { Recording } from '../models/Recording.js';

export const uploadRecording = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return sendError(res, 'No recording file uploaded', 400);
    }

    const { callId, deviceId, duration } = uploadRecordingSchema.parse(req.body);
    
    const recording = await recordingService.handleRecordingUpload(
      callId,
      deviceId,
      duration,
      req.file
    );

    return sendSuccess(res, { recording }, 'Recording uploaded successfully');
  } catch (error: any) {
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Failed to clean up file:', err);
      }
    }
    if (error.name === 'ZodError') {
      return sendError(res, 'Validation Error: ' + JSON.stringify(error.errors), 400);
    }
    return sendError(res, error.message, 500);
  }
};

export const getRecordings = async (req: Request, res: Response) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const query: any = {};
    
    if (req.query.search) {
      query.$or = [
        { contactName: { $regex: req.query.search, $options: 'i' } },
        { phoneNumber: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const [recordings, total] = await Promise.all([
      Recording.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('callId'),
      Recording.countDocuments(query)
    ]);

    return sendSuccess(res, formatPaginatedResponse(recordings, total, page, limit));
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const getRecordingById = async (req: Request, res: Response) => {
  try {
    const recording = await Recording.findById(req.params.id).populate('callId');
    if (!recording) return sendError(res, 'Recording not found', 404);
    
    return sendSuccess(res, { recording });
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const streamRecording = async (req: Request, res: Response) => {
  try {
    const recording = await Recording.findById(req.params.id);
    if (!recording) return sendError(res, 'Recording not found', 404);

    const filePath = path.resolve(recording.filePath);
    if (!fs.existsSync(filePath)) {
      return sendError(res, 'Recording file not found on server', 404);
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = (range as string).replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0] || "0", 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': recording.mimeType || 'audio/mp4',
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': recording.mimeType || 'audio/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};

export const deleteRecording = async (req: Request, res: Response) => {
  try {
    await recordingService.deleteRecording(req.params.id as string);
    return sendSuccess(res, null, 'Recording deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message, 500);
  }
};
