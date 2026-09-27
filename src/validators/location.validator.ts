import { z } from 'zod';

export const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().optional(),
  altitude: z.number().optional(),
  speed: z.number().optional(),
  bearing: z.number().optional(),
  batteryLevel: z.number().optional(),
  timestamp: z.string().or(z.date()).transform((val) => new Date(val)),
});

export const syncLocationsSchema = z.object({
  deviceId: z.string().min(1),
  locations: z.array(locationSchema),
});
