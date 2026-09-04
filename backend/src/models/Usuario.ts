import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Usuario extends Model {
  public id!: number;
  public email!: string;
  public password_hash!: string;
  public nombre!: string;
  public rol!: string;
  public comisionista_id?: number;
  public activo!: boolean;
}

Usuario.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.ENUM('admin', 'analista', 'gestor'),
    allowNull: false,
  },
  comisionista_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  sequelize,
  tableName: 'usuarios',
});
