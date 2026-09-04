import dotenv from 'dotenv';
dotenv.config();

import { sequelize } from '../config/database';
import { ClienteProducto } from '../models/ClienteProducto';
import { Usuario } from '../models/Usuario';
import { Comisionista } from '../models/Comisionista';
import { ReferenciaComisionista } from '../models/ReferenciaComisionista';
import { Cuenta } from '../models/Cuenta';
import { Gestion } from '../models/Gestion';
import { Evidencia } from '../models/Evidencia';
import { SeguimientoTorre } from '../models/SeguimientoTorre';
import bcrypt from 'bcryptjs';

import '../models/index';

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('✅ Database synced (force: true - all tables recreated)');

    // ========== Clientes/Productos ==========
    const clientes = await ClienteProducto.bulkCreate([
      {
        nombre: 'KAVAK',
        tipo: 'autos',
        descripcion: 'Gestión de créditos automotrices KAVAK',
        codigos_cierre: [
          'Contacto Exitoso', 'No Localizado', 'Se Dejó Notificación',
          'Promesa de Pago', 'Negativa de Pago', 'Domicilio No Existe',
          'Se Mudó', 'Vehículo Localizado', 'Vehículo Recuperado',
          'Pago Realizado', 'Convenio', 'Otro'
        ],
        activo: true,
      },
      {
        nombre: 'VENTO',
        tipo: 'motos',
        descripcion: 'Gestión de créditos de motocicletas VENTO',
        codigos_cierre: [
          'Contacto Exitoso', 'No Localizado', 'Se Dejó Notificación',
          'Promesa de Pago', 'Negativa de Pago', 'Domicilio No Existe',
          'Se Mudó', 'Dación en Pago', 'Motocicleta Recuperada',
          'Pago Realizado', 'Convenio', 'Otro'
        ],
        activo: true,
      },
      {
        nombre: 'CLIP',
        tipo: 'terminales',
        descripcion: 'Gestión de préstamos Clip (terminales POS)',
        codigos_cierre: [
          'Contacto Exitoso', 'No Localizado', 'Se Dejó Notificación',
          'Promesa de Pago', 'Negativa de Pago', 'Domicilio No Existe',
          'Se Mudó', 'Incontactable', 'Terminal Recolectada',
          'Pago Realizado', 'Convenio', 'Otro'
        ],
        activo: true,
      },
      {
        nombre: 'KONFIO',
        tipo: 'creditos_pyme',
        descripcion: 'Gestión de créditos PyME Konfío',
        codigos_cierre: [
          'Contacto Exitoso', 'No Localizado', 'Se Dejó Notificación',
          'Promesa de Pago', 'Negativa de Pago', 'Domicilio No Existe',
          'Se Mudó', 'Reestructura', 'Liquidación One Shot',
          'Pago Realizado', 'Convenio', 'Otro'
        ],
        activo: true,
      },
      {
        nombre: 'LAFIN',
        tipo: 'motos',
        descripcion: 'Gestión de créditos de motocicletas LAFIN',
        codigos_cierre: [
          'Contacto Exitoso', 'No Localizado', 'Se Dejó Notificación',
          'Promesa de Pago', 'Negativa de Pago', 'Domicilio No Existe',
          'Se Mudó', 'Dación en Pago', 'Motocicleta Recuperada',
          'Pago Realizado', 'Convenio', 'Otro'
        ],
        activo: true,
      },
    ]);
    console.log('✅ 5 ClienteProducto records seeded');

    // ========== Users ==========
    const adminHash = await bcrypt.hash('admin123', 10);
    const analistaHash = await bcrypt.hash('analista123', 10);
    const gestorHash = await bcrypt.hash('gestor123', 10);

    await Usuario.create({
      email: 'admin@crm.com',
      password_hash: adminHash,
      nombre: 'Administrador EAD BPO',
      rol: 'admin',
      activo: true,
    });

    await Usuario.create({
      email: 'analista@crm.com',
      password_hash: analistaHash,
      nombre: 'Analista Torre de Control',
      rol: 'analista',
      activo: true,
    });

    // ========== Comisionista / Gestor ==========
    const comisionista = await Comisionista.create({
      numero_identificacion: 'COM-0001',
      nombre: 'Carlos Mendoza Cruz',
      direccion: 'Av. Insurgentes Sur 1450, Col. Crédito Constructor, Benito Juárez, CDMX',
      estatus: 'Activo',
      municipios_alcance: [
        { estado: 'Ciudad de México', municipio: 'Benito Juárez' },
        { estado: 'Ciudad de México', municipio: 'Cuauhtémoc' },
        { estado: 'Ciudad de México', municipio: 'Miguel Hidalgo' },
        { estado: 'Ciudad de México', municipio: 'Coyoacán' },
      ],
    });

    await ReferenciaComisionista.bulkCreate([
      { comisionista_id: comisionista.id, nombre: 'María Elena Mendoza', telefono: '5512345678', parentesco: 'Madre' },
      { comisionista_id: comisionista.id, nombre: 'Roberto Cruz', telefono: '5587654321', parentesco: 'Hermano' },
    ]);

    await Usuario.create({
      email: 'gestor@crm.com',
      password_hash: gestorHash,
      nombre: 'Carlos Mendoza Cruz',
      rol: 'gestor',
      comisionista_id: comisionista.id,
      activo: true,
    });

    // ========== Cuentas Asignadas al Gestor (con coordenadas) ==========
    const cuentasAsignadas = await Cuenta.bulkCreate([
      {
        cliente_producto_id: 1, // KAVAK
        identificador_externo: 'KVK-2918093',
        nombre_titular: 'Marco Antonio Salazar Rodríguez',
        telefono: '5541928374',
        email: 'salazar.marco@gmail.com',
        direccion_completa: 'Calle Pípila 203, Col. Roma Sur, Cuauhtémoc, CDMX',
        colonia: 'Roma Sur',
        municipio: 'Cuauhtémoc',
        estado: 'Ciudad de México',
        cp: '06760',
        saldo_deudor: 43481.50,
        monto_vencido: 12500.00,
        dias_mora: 64,
        bucket: '61-90',
        riesgo: 'Medio Riesgo',
        estatus: 'Activa',
        comisionista_id: comisionista.id,
        fecha_asignacion: new Date(),
        latitud: 19.4085,
        longitud: -99.1628,
        comision_oferta: 400.00,
        datos_adicionales: { vehiculo: 'Nissan Frontier 2024', vin: '3N6AD33A4RK849436', requiere_video: true }
      },
      {
        cliente_producto_id: 2, // VENTO
        identificador_externo: 'VNT-5075881',
        nombre_titular: 'José Antonio Solís Sánchez',
        telefono: '5538920192',
        email: 'solis.jose@hotmail.com',
        direccion_completa: 'Av. Coyoacán 820, Col. Del Valle, Benito Juárez, CDMX',
        colonia: 'Del Valle',
        municipio: 'Benito Juárez',
        estado: 'Ciudad de México',
        cp: '03100',
        saldo_deudor: 17508.00,
        monto_vencido: 4740.00,
        dias_mora: 45,
        bucket: '31-60',
        riesgo: 'Medio Riesgo',
        estatus: 'Activa',
        comisionista_id: comisionista.id,
        fecha_asignacion: new Date(),
        latitud: 19.3824,
        longitud: -99.1698,
        comision_oferta: 350.00,
        datos_adicionales: { motocicleta: 'Falkon 250CC', num_pagos_atrasados: 3, requiere_video: true }
      },
      {
        cliente_producto_id: 3, // CLIP
        identificador_externo: 'CLP-12bd2c09',
        nombre_titular: 'Axel Joaquín Osorio Peña (B Mine Bar)',
        telefono: '5589123049',
        email: 'axel.osorio@bar.com',
        direccion_completa: 'Calle Sonora 140, Col. Condesa, Cuauhtémoc, CDMX',
        colonia: 'Condesa',
        municipio: 'Cuauhtémoc',
        estado: 'Ciudad de México',
        cp: '06140',
        saldo_deudor: 62978.50,
        monto_vencido: 18500.00,
        dias_mora: 38,
        bucket: '31-60',
        riesgo: 'Bajo Riesgo',
        estatus: 'Activa',
        comisionista_id: comisionista.id,
        fecha_asignacion: new Date(),
        latitud: 19.4140,
        longitud: -99.1720,
        comision_oferta: 300.00,
        datos_adicionales: { terminal: 'Clip Pro 2', monto_prestado: 386800.00 }
      },
      {
        cliente_producto_id: 4, // KONFIO
        identificador_externo: 'KNF-237000',
        nombre_titular: 'Sergio Pablo Castañeda Anaya (Transport Logistic)',
        telefono: '5544999961',
        email: 'spablo@trucka.com.mx',
        direccion_completa: 'Av. Revolución 520, Col. San Pedro de los Pinos, Benito Juárez, CDMX',
        colonia: 'San Pedro de los Pinos',
        municipio: 'Benito Juárez',
        estado: 'Ciudad de México',
        cp: '03800',
        saldo_deudor: 604951.74,
        monto_vencido: 128500.00,
        dias_mora: 42,
        bucket: '31-60',
        riesgo: 'Alto Riesgo',
        estatus: 'Activa',
        comisionista_id: comisionista.id,
        fecha_asignacion: new Date(),
        latitud: 19.3905,
        longitud: -99.1860,
        comision_oferta: 550.00,
        datos_adicionales: { oferta: 'Liquidación One Shot 50% desc.', empresa: 'TRANSPORT AND LOGISTIC SA DE CV' }
      }
    ]);

    // ========== Bolsa de Ofertas de Recolección (Estilo Uber) ==========
    await Cuenta.bulkCreate([
      {
        cliente_producto_id: 1, // KAVAK
        identificador_externo: 'KVK-3150457',
        nombre_titular: 'Miguel Ángel Gutiérrez Medina',
        telefono: '5511223344',
        email: 'gutierrez.m@gmail.com',
        direccion_completa: 'Calzada de Tlalpan 1800, Col. Country Club, Coyoacán, CDMX',
        colonia: 'Country Club',
        municipio: 'Coyoacán',
        estado: 'Ciudad de México',
        cp: '04220',
        saldo_deudor: 89400.00,
        monto_vencido: 26800.00,
        dias_mora: 80,
        bucket: '61-90',
        riesgo: 'Alto Riesgo',
        estatus: 'Activa',
        en_oferta: true,
        comision_oferta: 500.00, // $500 MXN comisión
        latitud: 19.3498,
        longitud: -99.1415,
        datos_adicionales: { vehiculo: 'Toyota Hilux 2016', requiere_video: true }
      },
      {
        cliente_producto_id: 2, // VENTO
        identificador_externo: 'VNT-5020097',
        nombre_titular: 'María Alba Betanzo Martínez',
        telefono: '5588776655',
        email: 'alba.betanzo@gmail.com',
        direccion_completa: 'Av. Universidad 1200, Col. Xoco, Benito Juárez, CDMX',
        colonia: 'Xoco',
        municipio: 'Benito Juárez',
        estado: 'Ciudad de México',
        cp: '03330',
        saldo_deudor: 22400.00,
        monto_vencido: 6800.00,
        dias_mora: 52,
        bucket: '31-60',
        riesgo: 'Medio Riesgo',
        estatus: 'Activa',
        en_oferta: true,
        comision_oferta: 380.00, // $380 MXN comisión
        latitud: 19.3640,
        longitud: -99.1685,
        datos_adicionales: { motocicleta: 'Colt 300', dacion_posible: true, requiere_video: true }
      },
      {
        cliente_producto_id: 5, // LAFIN
        identificador_externo: 'LAF-914.8831',
        nombre_titular: 'Marisol Cruz Sánchez',
        telefono: '5577665544',
        email: 'marisol.cruz@outlook.com',
        direccion_completa: 'Av. Insurgentes Norte 850, Col. Buenavista, Cuauhtémoc, CDMX',
        colonia: 'Buenavista',
        municipio: 'Cuauhtémoc',
        estado: 'Ciudad de México',
        cp: '06350',
        saldo_deudor: 11985.00,
        monto_vencido: 3600.00,
        dias_mora: 58,
        bucket: '31-60',
        riesgo: 'Bajo Riesgo',
        estatus: 'Activa',
        en_oferta: true,
        comision_oferta: 300.00, // $300 MXN comisión
        latitud: 19.4485,
        longitud: -99.1530,
        datos_adicionales: { periodo: 'Semanal', pago_fijo: 1201.00 }
      }
    ]);

    // Gestiones previas de ejemplo
    await Gestion.create({
      cuenta_id: cuentasAsignadas[0].id,
      comisionista_id: comisionista.id,
      latitud: 19.4085,
      longitud: -99.1628,
      precision_gps: '±4.2m',
      codigo_cierre: 'Promesa de Pago',
      resultado: 'Exitoso',
      notas: 'Se visitó al titular, manifiesta que realizará pago este viernes 5.',
      tipo_contacto: 'Presencial',
      fecha_gestion: new Date()
    });

    console.log('✅ Cuentas asignadas y bolsa de ofertas precargadas con éxito!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
