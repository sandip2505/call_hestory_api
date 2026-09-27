import mongoose, { Document, Schema } from 'mongoose';

export interface IDevice extends Document {
  deviceId: string;
  deviceName?: string;
  manufacturer?: string;
  deviceModel?: string;
  androidVersion?: string;
  appVersion?: string;
  firstSeenAt: Date;
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DeviceSchema = new Schema<IDevice>(
  {
    deviceId: { type: String, required: true, unique: true },
    deviceName: { type: String },
    manufacturer: { type: String },
    deviceModel: { type: String },
    androidVersion: { type: String },
    appVersion: { type: String },
    firstSeenAt: { type: Date, default: Date.now },
    lastSeenAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Device = mongoose.model<IDevice>('Device', DeviceSchema);
