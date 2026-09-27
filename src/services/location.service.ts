import { Location, type ILocation } from '../models/Location.js';
import { generateTimeline } from './timeline.service.js';

export const syncLocations = async (deviceId: string, locations: any[]) => {
  const operations = locations.map((loc) => ({
    updateOne: {
      filter: { deviceId, timestamp: loc.timestamp },
      update: { $set: { ...loc, deviceId } },
      upsert: true,
    },
  }));

  if (operations.length === 0) {
    return { inserted: 0, updated: 0 };
  }

  const result = await Location.bulkWrite(operations, { ordered: false });
  return {
    inserted: result.upsertedCount || 0,
    updated: result.modifiedCount || 0,
    duplicates: locations.length - ((result.upsertedCount || 0) + (result.modifiedCount || 0)), // Approximation
  };
};

export const getCurrentLocation = async (deviceId: string) => {
  return Location.findOne({ deviceId }).sort({ timestamp: -1 });
};

export const getLocationHistory = async (
  deviceId: string,
  from?: Date,
  to?: Date,
  skip: number = 0,
  limit: number = 100
) => {
  const query: any = { deviceId };
  
  if (from || to) {
    query.timestamp = {};
    if (from) query.timestamp.$gte = from;
    if (to) query.timestamp.$lte = to;
  }

  const total = await Location.countDocuments(query);
  const data = await Location.find(query)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit);

  return { total, data };
};

export const getLocationTimeline = async (deviceId: string, dateString: string) => {
  const startOfDay = new Date(dateString);
  startOfDay.setUTCHours(0, 0, 0, 0);
  
  const endOfDay = new Date(startOfDay);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const locations = await Location.find({
    deviceId,
    timestamp: { $gte: startOfDay, $lte: endOfDay },
  }).sort({ timestamp: 1 }); // Important to sort ascending for timeline

  const visits = generateTimeline(locations, 50, 5); // 50 meters, 5 minutes
  return visits;
};
