import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Cuenta extends Model {
  public id!: number;
  public cliente_producto_id!: number;
  public identificador_externo!: string;
  public nombre_titular!: string;
  public telefono?: string;
  public email?: string;
  public direccion_completa?: string;
  public colonia?: string;
  public municipio?: string;
  public estado?: string;
  public cp?: string;
  public saldo_deudor!: number;
  public monto_vencido!: number;
  public dias_mora!: number;
  public bucket?: string;
  public riesgo?: string;
  public estatus!: string;
  public datos_adicionales!: any;
  public comisionista_id?: number;
  public lote_carga?: string;
  public fecha_asignacion?: Date;
  public en_oferta!: boolean;
  public comision_oferta!: number;
  public latitud?: number;
  public longitud?: number;
}

Cuenta.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cliente_producto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  identificador_externo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nombre_titular: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono: { type: DataTypes.STRING, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: true },
  direccion_completa: { type: DataTypes.TEXT, allowNull: true },
  colonia: { type: DataTypes.STRING, allowNull: true },
  municipio: { type: DataTypes.STRING, allowNull: true },
  estado: { type: DataTypes.STRING, allowNull: true },
  cp: { type: DataTypes.STRING, allowNull: true },
  saldo_deudor: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  monto_vencido: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  dias_mora: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  bucket: { type: DataTypes.STRING, allowNull: true },
  riesgo: { type: DataTypes.STRING, allowNull: true },
  estatus: {
    type: DataTypes.ENUM('Activa', 'Pagada', 'WriteOff', 'Dacion'),
    defaultValue: 'Activa',
  },
  datos_adicionales: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  comisionista_id: { type: DataTypes.INTEGER, allowNull: true },
  lote_carga: { type: DataTypes.STRING, allowNull: true },
  fecha_asignacion: { type: DataTypes.DATE, allowNull: true },
  en_oferta: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  comision_oferta: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  latitud: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
  },
  longitud: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'cuentas',
});
