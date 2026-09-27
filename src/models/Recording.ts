import mongoose, { Document, Schema } from 'mongoose';

export interface IRecording extends Document {
  callId: mongoose.Types.ObjectId;
  deviceId: string;
  phoneNumber: string;
  contactName?: string;
  fileName: string;
  originalFileName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

const RecordingSchema = new Schema<IRecording>(
  {
    callId: { type: Schema.Types.ObjectId, ref: 'Call', required: true },
    deviceId: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    contactName: { type: String },
    fileName: { type: String, required: true },
    originalFileName: { type: String, required: true },
    filePath: { type: String, required: true },
    mimeType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    duration: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const Recording = mongoose.model<IRecording>('Recording', RecordingSchema);
