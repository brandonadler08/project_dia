import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Comisionista extends Model {
  public id!: number;
  public numero_identificacion!: string;
  public nombre!: string;
  public direccion!: string;
  public estatus!: string;
  public ine_frente_url?: string;
  public ine_reverso_url?: string;
  public comprobante_domicilio_url?: string;
  public licencia_moto_url?: string;
  public licencia_auto_url?: string;
  public rfc_url?: string;
  public curp_url?: string;
  public municipios_alcance!: any;
}

Comisionista.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  numero_identificacion: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  estatus: {
    type: DataTypes.ENUM('Activo', 'StandBy', 'Baja'),
    defaultValue: 'Activo',
  },
  ine_frente_url: { type: DataTypes.STRING, allowNull: true },
  ine_reverso_url: { type: DataTypes.STRING, allowNull: true },
  comprobante_domicilio_url: { type: DataTypes.STRING, allowNull: true },
  licencia_moto_url: { type: DataTypes.STRING, allowNull: true },
  licencia_auto_url: { type: DataTypes.STRING, allowNull: true },
  rfc_url: { type: DataTypes.STRING, allowNull: true },
  curp_url: { type: DataTypes.STRING, allowNull: true },
  municipios_alcance: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
}, {
  sequelize,
  tableName: 'comisionistas',
});
