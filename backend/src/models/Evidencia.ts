import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Evidencia extends Model {
  public id!: number;
  public gestion_id!: number;
  public tipo!: string;
  public url!: string;
  public nombre_archivo!: string;
}

Evidencia.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  gestion_id: { type: DataTypes.INTEGER, allowNull: false },
  tipo: {
    type: DataTypes.ENUM('Foto', 'Video'),
    allowNull: false,
  },
  url: { type: DataTypes.STRING, allowNull: false },
  nombre_archivo: { type: DataTypes.STRING, allowNull: false },
}, {
  sequelize,
  tableName: 'evidencias',
});
