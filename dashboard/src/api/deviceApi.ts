import api from './axios';

export const deviceApi = {
  getDevices: (params?: any) => api.get('/devices', { params }) as Promise<any>,
  getDeviceById: (id: string) => api.get(`/devices/${id}`) as Promise<any>,
};
