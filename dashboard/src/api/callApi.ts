import api from './axios';

export const callApi = {
  getCalls: (params: any) => api.get('/calls', { params }) as Promise<any>,
  getCallById: (id: string) => api.get(`/calls/${id}`) as Promise<any>,
  deleteCall: (id: string) => api.delete(`/calls/${id}`) as Promise<any>,
};
