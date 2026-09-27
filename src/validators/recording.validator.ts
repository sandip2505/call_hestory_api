import { z } from 'zod';

export const uploadRecordingSchema = z.object({
  callId: z.string().min(1),
  deviceId: z.string().min(1),
  duration: z.string().optional().transform(val => {
    const num = val ? Number(val) : 0;
    return isNaN(num) ? 0 : num;
  }),
});
