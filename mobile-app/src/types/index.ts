export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  numero_comisionista?: string;
}

export interface Cliente {
  id: number;
  nombre: string;
}

export interface Cuenta {
  id: number;
  titular: string;
  cliente_id: number;
  cliente: Cliente;
  dias_mora: number;
  saldo: number;
  monto_vencido: number;
  bucket: string;
  telefono: string;
  email: string;
  direccion_completa: string;
  datos_adicionales: any;
  estado: string;
}

export interface Gestion {
  id: number;
  cuenta_id: number;
  gestor_id: number;
  fecha: string;
  latitud: number;
  longitud: number;
  precision_gps?: number;
  codigo_cierre: string;
  resultado_exitoso: boolean;
  notas: string;
  cuenta?: Cuenta;
  evidencias?: Evidencia[];
}

export interface Evidencia {
  id: number;
  gestion_id: number;
  tipo: 'foto' | 'video';
  url: string;
  fecha_subida: string;
}

export interface LoginResponse {
  token: string;
  user: Usuario;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}
