import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Importacion extends Model {
  public id!: number;
  public cliente_producto_id!: number;
  public archivo_nombre!: string;
  public registros_totales!: number;
  public registros_exitosos!: number;
  public registros_error!: number;
  public errores_detalle!: any;
  public usuario_id!: number;
  public fecha!: Date;
}

Importacion.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  cliente_producto_id: { type: DataTypes.INTEGER, allowNull: false },
  archivo_nombre: { type: DataTypes.STRING, allowNull: false },
  registros_totales: { type: DataTypes.INTEGER, defaultValue: 0 },
  registros_exitosos: { type: DataTypes.INTEGER, defaultValue: 0 },
  registros_error: { type: DataTypes.INTEGER, defaultValue: 0 },
  errores_detalle: { type: DataTypes.JSON, defaultValue: [] },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  fecha: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, { sequelize, tableName: 'importaciones' });
