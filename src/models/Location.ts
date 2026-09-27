import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation extends Document {
  deviceId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  speed?: number;
  bearing?: number;
  batteryLevel?: number;
  timestamp: Date;
  createdAt: Date;
}

const LocationSchema = new Schema<ILocation>(
  {
    deviceId: { type: String, required: true, index: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    accuracy: { type: Number },
    altitude: { type: Number },
    speed: { type: Number },
    bearing: { type: Number },
    batteryLevel: { type: Number },
    timestamp: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Compound index for querying device history efficiently
LocationSchema.index({ deviceId: 1, timestamp: -1 });
// Compound index to prevent duplicates
LocationSchema.index({ deviceId: 1, timestamp: 1 }, { unique: true });

export const Location = mongoose.model<ILocation>('Location', LocationSchema);
