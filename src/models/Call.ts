import mongoose, { Document, Schema } from 'mongoose';

export interface ICall extends Document {
  deviceId: string;
  androidCallId: string;
  phoneNumber: string;
  normalizedPhoneNumber: string;
  contactName?: string;
  contactPhoto?: string;
  callType: 'incoming' | 'outgoing' | 'missed' | 'rejected' | 'blocked' | 'unknown';
  timestamp: Date;
  duration: number;
  recordingAvailable: boolean;
  isDeletedOnDevice: boolean;
  recordingId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CallSchema = new Schema<ICall>(
  {
    deviceId: { type: String, required: true },
    androidCallId: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    normalizedPhoneNumber: { type: String, required: true },
    contactName: { type: String },
    contactPhoto: { type: String },
    callType: {
      type: String,
      enum: ['incoming', 'outgoing', 'missed', 'rejected', 'blocked', 'unknown'],
      required: true,
    },
    timestamp: { type: Date, required: true },
    duration: { type: Number, required: true, default: 0 },
    recordingAvailable: { type: Boolean, default: false },
    isDeletedOnDevice: { type: Boolean, default: false },
    recordingId: { type: Schema.Types.ObjectId, ref: 'Recording' },
  },
  { timestamps: true }
);

// Prevent duplicates
CallSchema.index({ deviceId: 1, androidCallId: 1 }, { unique: true });
// Index for faster queries
CallSchema.index({ timestamp: -1 });
CallSchema.index({ normalizedPhoneNumber: 1 });
CallSchema.index({ callType: 1 });

export const Call = mongoose.model<ICall>('Call', CallSchema);
