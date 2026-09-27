import { Call } from '../models/Call.js';
import { Recording } from '../models/Recording.js';
import fs from 'fs';

import mongoose from 'mongoose';

export const handleRecordingUpload = async (callId: string, deviceId: string, duration: number, file: Express.Multer.File) => {
  let query: any = { androidCallId: callId, deviceId };
  if (mongoose.Types.ObjectId.isValid(callId)) {
    query = { $or: [{ _id: callId }, { androidCallId: callId }], deviceId };
  }
  const call = await Call.findOne(query);
  if (!call) {
    // Clean up file if call doesn't exist
    fs.unlinkSync(file.path);
    throw new Error('Call not found for this device');
  }

  const recording = await Recording.create({
    callId: call._id,
    deviceId,
    phoneNumber: call.phoneNumber,
    contactName: call.contactName || '',
    fileName: file.filename,
    originalFileName: file.originalname,
    filePath: file.path,
    mimeType: file.mimetype,
    fileSize: file.size,
    duration,
  });

  call.recordingAvailable = true;
  call.recordingId = recording._id as any;
  await call.save();

  return recording;
};

export const deleteRecording = async (recordingId: string) => {
  const recording = await Recording.findById(recordingId);
  if (!recording) throw new Error('Recording not found');

  try {
    if (fs.existsSync(recording.filePath)) {
      fs.unlinkSync(recording.filePath);
    }
  } catch (error) {
    console.error('Error deleting file physically:', error);
  }

  await Call.findByIdAndUpdate(recording.callId, {
    recordingAvailable: false,
    $unset: { recordingId: 1 }
  });

  await Recording.findByIdAndDelete(recordingId);
};
