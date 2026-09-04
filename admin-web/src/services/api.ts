import axios from 'axios';
import { 
  LoginForm, 
  ApiResponse, 
  PaginatedResponse, 
  Comisionista, 
  Cuenta, 
  Gestion, 
  SeguimientoTorre, 
  Importacion,
  ComisionistaForm,
  ClienteProducto
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: LoginForm) => api.post<{token: string, user: any}>('/auth/login', data).then(res => res.data),
};

export const comisionistasApi = {
  getAll: () => api.get<PaginatedResponse<Comisionista>>('/comisionistas').then(res => res.data),
  getById: (id: string) => api.get<ApiResponse<Comisionista>>(`/comisionistas/${id}`).then(res => res.data),
  create: (data: ComisionistaForm) => api.post<ApiResponse<Comisionista>>('/comisionistas', data).then(res => res.data),
  update: (id: string, data: Partial<ComisionistaForm>) => api.put<ApiResponse<Comisionista>>(`/comisionistas/${id}`, data).then(res => res.data),
  updateEstatus: (id: string, estatus: string) => api.patch<ApiResponse<Comisionista>>(`/comisionistas/${id}/estatus`, { estatus }).then(res => res.data),
  getMunicipios: (id: string) => api.get<ApiResponse<string[]>>(`/comisionistas/${id}/municipios`).then(res => res.data),
  updateMunicipios: (id: string, municipios: string[]) => api.put<ApiResponse<any>>(`/comisionistas/${id}/municipios`, { municipios }).then(res => res.data),
};

export const cuentasApi = {
  getAll: (params?: any) => api.get<PaginatedResponse<Cuenta>>('/cuentas', { params }).then(res => res.data),
  getSinAsignar: () => api.get<PaginatedResponse<Cuenta>>('/cuentas/sin-asignar').then(res => res.data),
  getById: (id: string) => api.get<ApiResponse<Cuenta>>(`/cuentas/${id}`).then(res => res.data),
  asignar: (cuentaIds: string[], comisionistaId: string) => api.post<ApiResponse<any>>('/cuentas/asignar', { cuentaIds, comisionistaId }).then(res => res.data),
};

export const carterasApi = {
  upload: (file: File, cliente: ClienteProducto) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('cliente', cliente);
    return api.post<ApiResponse<Importacion>>('/carteras/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },
  getImportaciones: () => api.get<PaginatedResponse<Importacion>>('/carteras/importaciones').then(res => res.data),
  getImportacionById: (id: string) => api.get<ApiResponse<Importacion>>(`/carteras/importaciones/${id}`).then(res => res.data),
};

export const gestionesApi = {
  getByCuenta: (cuentaId: string) => api.get<PaginatedResponse<Gestion>>(`/gestiones/cuenta/${cuentaId}`).then(res => res.data),
  getByComisionista: (comisionistaId: string) => api.get<PaginatedResponse<Gestion>>(`/gestiones/comisionista/${comisionistaId}`).then(res => res.data),
};

export const torreApi = {
  getDashboard: () => api.get<ApiResponse<any>>('/torre/dashboard').then(res => res.data),
  addSeguimiento: (cuentaId: string, comentario: string) => api.post<ApiResponse<SeguimientoTorre>>('/torre/seguimiento', { cuentaId, comentario }).then(res => res.data),
  getSeguimientos: (cuentaId: string) => api.get<PaginatedResponse<SeguimientoTorre>>(`/torre/seguimiento/${cuentaId}`).then(res => res.data),
};

export const reportesApi = {
  getGestion: (params: any) => api.get<ApiResponse<any>>('/reportes/gestion', { params }).then(res => res.data),
  getByCliente: (cliente: string) => api.get<ApiResponse<any>>(`/reportes/cliente/${cliente}`).then(res => res.data),
  exportar: (params: any) => api.get('/reportes/exportar', { params, responseType: 'blob' }),
};
