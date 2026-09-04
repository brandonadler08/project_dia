import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Gestion extends Model {
  public id!: number;
  public cuenta_id!: number;
  public comisionista_id!: number;
  public latitud!: number;
  public longitud!: number;
  public precision_gps?: string;
  public codigo_cierre!: string;
  public resultado!: string;
  public notas?: string;
  public tipo_contacto!: string;
  public fecha_gestion!: Date;
}

Gestion.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cuenta_id: { type: DataTypes.INTEGER, allowNull: false },
  comisionista_id: { type: DataTypes.INTEGER, allowNull: false },
  latitud: { type: DataTypes.DECIMAL(10, 8), allowNull: false },
  longitud: { type: DataTypes.DECIMAL(11, 8), allowNull: false },
  precision_gps: { type: DataTypes.STRING, allowNull: true },
  codigo_cierre: { type: DataTypes.STRING, allowNull: false },
  resultado: {
    type: DataTypes.ENUM('Exitoso', 'No Exitoso', 'Pendiente'),
    allowNull: false,
  },
  notas: { type: DataTypes.TEXT, allowNull: true },
  tipo_contacto: {
    type: DataTypes.ENUM('Presencial', 'Telefonico'),
    defaultValue: 'Presencial',
  },
  fecha_gestion: { type: DataTypes.DATE, allowNull: false },
}, {
  sequelize,
  tableName: 'gestiones',
});
