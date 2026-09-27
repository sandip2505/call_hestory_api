import { z } from 'zod';

export const callSchema = z.object({
  androidCallId: z.string().min(1),
  phoneNumber: z.string().min(1),
  normalizedPhoneNumber: z.string().min(1),
  contactName: z.string().optional(),
  contactPhoto: z.string().optional(),
  callType: z.enum(['incoming', 'outgoing', 'missed', 'rejected', 'blocked', 'unknown']),
  timestamp: z.number().or(z.date()),
  duration: z.number().min(0),
  recordingAvailable: z.boolean().default(false),
});

export const syncCallsSchema = z.object({
  device: z.object({
    deviceId: z.string().min(1),
    deviceName: z.string().optional(),
    manufacturer: z.string().optional(),
    model: z.string().optional(),
    androidVersion: z.string().optional(),
    appVersion: z.string().optional(),
  }),
  calls: z.array(callSchema),
});
