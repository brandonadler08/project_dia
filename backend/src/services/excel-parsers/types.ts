export interface CuentaData {
  identificador_externo: string;
  nombre_titular: string;
  telefono?: string;
  email?: string;
  direccion_completa?: string;
  colonia?: string;
  municipio?: string;
  estado?: string;
  cp?: string;
  saldo_deudor: number;
  monto_vencido: number;
  dias_mora: number;
  bucket?: string;
  riesgo?: string;
  datos_adicionales: Record<string, any>;
}

export interface ParseResult {
  success: boolean;
  cuentas: CuentaData[];
  errors: { row: number; message: string; data?: any }[];
  totalRows: number;
  sheet: string;
}
