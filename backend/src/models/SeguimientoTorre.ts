import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class SeguimientoTorre extends Model {
  public id!: number;
  public cuenta_id!: number;
  public analista_id!: number;
  public comentario!: string;
  public accion?: string;
  public fecha!: Date;
}

SeguimientoTorre.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cuenta_id: { type: DataTypes.INTEGER, allowNull: false },
  analista_id: { type: DataTypes.INTEGER, allowNull: false },
  comentario: { type: DataTypes.TEXT, allowNull: false },
  accion: { type: DataTypes.STRING, allowNull: true },
  fecha: { type: DataTypes.DATE, allowNull: false },
}, {
  sequelize,
  tableName: 'seguimientos_torre',
});
