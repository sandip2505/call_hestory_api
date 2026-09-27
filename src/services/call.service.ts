import { Call } from '../models/Call.js';
import { Device } from '../models/Device.js';

export const syncCalls = async (deviceData: any, callsData: any[]) => {
  // Update or create device
  const device = await Device.findOneAndUpdate(
    { deviceId: deviceData.deviceId },
    {
      ...deviceData,
      lastSeenAt: new Date(),
    },
    { upsert: true, new: true }
  );

  let created = 0;
  let duplicates = 0;
  let failed = 0;

  for (const call of callsData) {
    try {
      const existingCall = await Call.findOne({
        deviceId: device.deviceId,
        androidCallId: call.androidCallId,
      });

      if (existingCall) {
        duplicates++;
        continue;
      }

      await Call.create({
        ...call,
        deviceId: device.deviceId,
        timestamp: new Date(call.timestamp),
      });

      created++;
    } catch (error) {
      console.error('Failed to sync call', error);
      failed++;
    }
  }

  // Mark calls as deleted if they are not in the sync payload
  const activeAndroidCallIds = callsData.map(c => String(c.androidCallId));
  if (activeAndroidCallIds.length > 0) {
    await Call.updateMany(
      { deviceId: device.deviceId, androidCallId: { $nin: activeAndroidCallIds } },
      { $set: { isDeletedOnDevice: true } }
    );
    await Call.updateMany(
      { deviceId: device.deviceId, androidCallId: { $in: activeAndroidCallIds } },
      { $set: { isDeletedOnDevice: false } }
    );
  }

  return {
    received: callsData.length,
    created,
    duplicates,
    failed,
  };
};

export const getCalls = async (filters: any, skip: number, limit: number, sort: any = { timestamp: -1 }) => {
  const query: any = {};

  if (filters.search) {
    query.$or = [
      { contactName: { $regex: filters.search, $options: 'i' } },
      { normalizedPhoneNumber: { $regex: filters.search.replace(/\D/g, ''), $options: 'i' } },
      { phoneNumber: { $regex: filters.search, $options: 'i' } }
    ];
  }

  if (filters.type && filters.type !== 'all') query.callType = filters.type;
  if (filters.hasRecording === 'true') query.recordingAvailable = true;
  if (filters.isDeleted === 'true') query.isDeletedOnDevice = true;
  
  if (filters.startDate || filters.endDate) {
    query.timestamp = {};
    if (filters.startDate) query.timestamp.$gte = new Date(filters.startDate);
    if (filters.endDate) query.timestamp.$lte = new Date(filters.endDate);
  }

  const [calls, total] = await Promise.all([
    Call.find(query).sort(sort).skip(skip).limit(limit),
    Call.countDocuments(query)
  ]);

  return { calls, total };
};
