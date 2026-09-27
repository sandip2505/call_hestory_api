import api from './axios';

export const recordingApi = {
  getRecordings: (params: any) => api.get('/recordings', { params }) as Promise<any>,
  getRecordingById: (id: string) => api.get(`/recordings/${id}`) as Promise<any>,
  deleteRecording: (id: string) => api.delete(`/recordings/${id}`) as Promise<any>,
  getStreamUrl: (id: string) => `/api/recordings/${id}/stream`,
};
