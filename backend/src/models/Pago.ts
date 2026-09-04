import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Pago extends Model {
  public id!: number;
  public cuenta_id!: number;
  public monto!: number;
  public fuente?: string;
  public fecha_pago!: Date;
  public datos_adicionales!: any;
}

Pago.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  cuenta_id: { type: DataTypes.INTEGER, allowNull: false },
  monto: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  fuente: { type: DataTypes.STRING, allowNull: true },
  fecha_pago: { type: DataTypes.DATE, allowNull: false },
  datos_adicionales: { type: DataTypes.JSON, defaultValue: {} },
}, { sequelize, tableName: 'pagos' });
