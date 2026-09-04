import axios from 'axios';
import { API_URL, TIMEOUT } from '../config/api';
import { getToken } from './auth';

const api = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }).then(res => res.data),
};

export const cuentasApi = {
  getMisAsignadas: (filters?: any, page = 1) => 
    api.get('/cuentas/mis-asignadas', { params: { ...filters, page } }).then(res => res.data),
  getById: (id: number) => 
    api.get(`/cuentas/${id}`).then(res => res.data),
};

export const gestionesApi = {
  crear: (data: any) => 
    api.post('/gestiones', data).then(res => res.data),
  
  subirEvidencia: async (gestionId: number, fileUri: string, tipo: 'foto' | 'video') => {
    const formData = new FormData();
    const filename = fileUri.split('/').pop() || `${tipo}_${Date.now()}.jpg`;
    
    // @ts-ignore
    formData.append('evidencia', {
      uri: fileUri,
      name: filename,
      type: tipo === 'foto' ? 'image/jpeg' : 'video/mp4',
    });
    
    formData.append('tipo', tipo);

    return api.post(`/gestiones/${gestionId}/evidencias`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data);
  },

  getMisGestiones: (page = 1) => 
    api.get('/gestiones/mis-gestiones', { params: { page } }).then(res => res.data),
};

export default api;
