import api from './axios';

export const locationApi = {
  getCurrentLocation: (deviceId: string) => 
    api.get(`/location/current`, { params: { deviceId } }) as Promise<any>,
  
  getLocationHistory: (deviceId: string, from?: string, to?: string) => 
    api.get(`/location/history`, { params: { deviceId, from, to } }) as Promise<any>,
    
  getLocationTimeline: (deviceId: string, date?: string) => 
    api.get(`/location/timeline`, { params: { deviceId, date } }) as Promise<any>,
};
