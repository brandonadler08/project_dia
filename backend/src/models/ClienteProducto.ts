import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class ClienteProducto extends Model {
  public id!: number;
  public nombre!: string;
  public tipo!: string;
  public descripcion?: string;
  public layout_config?: any;
  public codigos_cierre?: any;
  public activo!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ClienteProducto.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  layout_config: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  codigos_cierre: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  sequelize,
  tableName: 'cliente_productos',
});
