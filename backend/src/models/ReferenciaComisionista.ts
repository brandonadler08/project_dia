import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class ReferenciaComisionista extends Model {
  public id!: number;
  public comisionista_id!: number;
  public nombre!: string;
  public telefono!: string;
  public parentesco!: string;
}

ReferenciaComisionista.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  comisionista_id: { type: DataTypes.INTEGER, allowNull: false },
  nombre: { type: DataTypes.STRING, allowNull: false },
  telefono: { type: DataTypes.STRING, allowNull: false },
  parentesco: { type: DataTypes.STRING, allowNull: false },
}, {
  sequelize,
  tableName: 'referencias_comisionistas',
  timestamps: false,
});
