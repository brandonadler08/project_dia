export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  success: boolean;
}

export type ClienteProducto = 'KAVAK' | 'VENTO' | 'CLIP' | 'KONFÍO' | 'LAFIN';
export type EstatusComisionista = 'ACTIVO' | 'STANDBY' | 'BAJA';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'ADMIN' | 'ANALISTA' | 'COORDINADOR';
}

export interface ReferenciaComisionista {
  nombre: string;
  telefono: string;
  parentesco: string;
}

export interface Comisionista {
  id: string;
  nombre: string;
  direccion: string;
  estatus: EstatusComisionista;
  referencias: ReferenciaComisionista[];
  municipiosAsignados: string[];
  fechaRegistro: string;
}

export interface Cuenta {
  id: string;
  cliente: ClienteProducto;
  identificador: string;
  nombreCliente: string;
  bucket: string;
  estado: string;
  municipio: string;
  estatus: string;
  comisionistaId?: string;
  saldo: number;
}

export interface Evidencia {
  id: string;
  url: string;
  tipo: string;
}

export interface Gestion {
  id: string;
  cuentaId: string;
  comisionistaId: string;
  fecha: string;
  resultado: string;
  comentarios: string;
  evidencias: Evidencia[];
}

export interface SeguimientoTorre {
  id: string;
  cuentaId: string;
  analistaId: string;
  comentario: string;
  fecha: string;
}

export interface Pago {
  id: string;
  cuentaId: string;
  monto: number;
  fecha: string;
}

export interface Importacion {
  id: string;
  cliente: ClienteProducto;
  fecha: string;
  totalRegistros: number;
  exitosos: number;
  errores: number;
  usuarioId: string;
}

export interface LoginForm {
  email: string;
  password?: string; // Simplificado para demo
}

export interface ComisionistaForm {
  nombre: string;
  direccion: string;
  referencias: ReferenciaComisionista[];
}

export interface AsignacionForm {
  cuentaIds: string[];
  comisionistaId: string;
}
