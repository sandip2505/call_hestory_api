import api from './axios';

export const dashboardApi = {
  getSummary: () => api.get('/dashboard/summary') as Promise<any>,
  getDailyCalls: (days?: number) => api.get('/dashboard/daily-calls', { params: { days } }) as Promise<any>,
  getTopContacts: (limit?: number) => api.get('/dashboard/top-contacts', { params: { limit } }) as Promise<any>,
  wipeAllData: () => api.delete('/dashboard/wipe-all') as Promise<any>,
};
