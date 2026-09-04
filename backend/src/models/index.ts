import { sequelize } from '../config/database';
import { ClienteProducto } from './ClienteProducto';
import { Usuario } from './Usuario';
import { Comisionista } from './Comisionista';
import { ReferenciaComisionista } from './ReferenciaComisionista';
import { Cuenta } from './Cuenta';
import { Gestion } from './Gestion';
import { Evidencia } from './Evidencia';
import { SeguimientoTorre } from './SeguimientoTorre';
import { Pago } from './Pago';
import { Importacion } from './Importacion';

// ========== Associations ==========

// ClienteProducto -> Cuentas
ClienteProducto.hasMany(Cuenta, { foreignKey: 'cliente_producto_id', as: 'cuentas' });
Cuenta.belongsTo(ClienteProducto, { foreignKey: 'cliente_producto_id', as: 'clienteProducto' });

// ClienteProducto -> Importaciones
ClienteProducto.hasMany(Importacion, { foreignKey: 'cliente_producto_id', as: 'importaciones' });
Importacion.belongsTo(ClienteProducto, { foreignKey: 'cliente_producto_id', as: 'clienteProducto' });

// Comisionista -> Cuentas
Comisionista.hasMany(Cuenta, { foreignKey: 'comisionista_id', as: 'cuentas' });
Cuenta.belongsTo(Comisionista, { foreignKey: 'comisionista_id', as: 'comisionista' });

// Comisionista -> Referencias
Comisionista.hasMany(ReferenciaComisionista, { foreignKey: 'comisionista_id', as: 'referencias' });
ReferenciaComisionista.belongsTo(Comisionista, { foreignKey: 'comisionista_id', as: 'comisionista' });

// Comisionista -> Gestiones
Comisionista.hasMany(Gestion, { foreignKey: 'comisionista_id', as: 'gestiones' });
Gestion.belongsTo(Comisionista, { foreignKey: 'comisionista_id', as: 'comisionista' });

// Comisionista -> Usuario (gestor user linked to comisionista)
Comisionista.hasOne(Usuario, { foreignKey: 'comisionista_id', as: 'usuario' });
Usuario.belongsTo(Comisionista, { foreignKey: 'comisionista_id', as: 'comisionista' });

// Cuenta -> Gestiones
Cuenta.hasMany(Gestion, { foreignKey: 'cuenta_id', as: 'gestiones' });
Gestion.belongsTo(Cuenta, { foreignKey: 'cuenta_id', as: 'cuenta' });

// Gestion -> Evidencias
Gestion.hasMany(Evidencia, { foreignKey: 'gestion_id', as: 'evidencias' });
Evidencia.belongsTo(Gestion, { foreignKey: 'gestion_id', as: 'gestion' });

// Cuenta -> SeguimientosTorre
Cuenta.hasMany(SeguimientoTorre, { foreignKey: 'cuenta_id', as: 'seguimientos' });
SeguimientoTorre.belongsTo(Cuenta, { foreignKey: 'cuenta_id', as: 'cuenta' });

// Usuario (analista) -> SeguimientosTorre
Usuario.hasMany(SeguimientoTorre, { foreignKey: 'analista_id', as: 'seguimientos' });
SeguimientoTorre.belongsTo(Usuario, { foreignKey: 'analista_id', as: 'analista' });

// Cuenta -> Pagos
Cuenta.hasMany(Pago, { foreignKey: 'cuenta_id', as: 'pagos' });
Pago.belongsTo(Cuenta, { foreignKey: 'cuenta_id', as: 'cuenta' });

// Usuario -> Importaciones
Usuario.hasMany(Importacion, { foreignKey: 'usuario_id', as: 'importaciones' });
Importacion.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// ========== Initialize ==========

export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to database established successfully.');
    await sequelize.sync();
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

// ========== Exports ==========

export {
  sequelize,
  ClienteProducto,
  Usuario,
  Comisionista,
  ReferenciaComisionista,
  Cuenta,
  Gestion,
  Evidencia,
  SeguimientoTorre,
  Pago,
  Importacion,
};
