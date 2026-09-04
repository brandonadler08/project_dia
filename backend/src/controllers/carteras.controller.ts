import { Request, Response } from 'express';
import { Importacion, Cuenta, ClienteProducto } from '../models';
import { parseCartera, detectClientType } from '../services/excel-parsers';
import path from 'path';

export const uploadCartera = async (req: Request, res: Response) => {
  try {
    const { cliente_producto_id } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'Archivo no proporcionado' });
    }

    if (!cliente_producto_id) {
      return res.status(400).json({ success: false, message: 'cliente_producto_id es requerido' });
    }

    // Verify client exists
    const cliente = await ClienteProducto.findByPk(cliente_producto_id);
    if (!cliente) {
      return res.status(404).json({ success: false, message: 'Cliente/Producto no encontrado' });
    }

    // Parse the Excel file using the appropriate parser
    const filePath = file.path;
    const parseResult = await parseCartera(filePath, parseInt(cliente_producto_id));

    // Create accounts from parsed data
    const lote_carga = `LOTE-${Date.now()}`;
    let registros_exitosos = 0;
    let registros_error = 0;
    const errores: { row: number; message: string; data?: any }[] = [...parseResult.errors];

    for (let i = 0; i < parseResult.cuentas.length; i++) {
      try {
        const cuentaData = parseResult.cuentas[i];
        await Cuenta.create({
          cliente_producto_id: parseInt(cliente_producto_id),
          identificador_externo: cuentaData.identificador_externo,
          nombre_titular: cuentaData.nombre_titular,
          telefono: cuentaData.telefono || null,
          email: cuentaData.email || null,
          direccion_completa: cuentaData.direccion_completa || null,
          colonia: cuentaData.colonia || null,
          municipio: cuentaData.municipio || null,
          estado: cuentaData.estado || null,
          cp: cuentaData.cp || null,
          saldo_deudor: cuentaData.saldo_deudor || 0,
          monto_vencido: cuentaData.monto_vencido || 0,
          dias_mora: cuentaData.dias_mora || 0,
          bucket: cuentaData.bucket || null,
          riesgo: cuentaData.riesgo || null,
          estatus: 'Activa',
          datos_adicionales: cuentaData.datos_adicionales || {},
          lote_carga,
        });
        registros_exitosos++;
      } catch (error: any) {
        registros_error++;
        errores.push({
          row: i + 1,
          message: error.message || 'Error al crear cuenta',
          data: parseResult.cuentas[i],
        });
      }
    }

    // Create import record
    const importacion = await Importacion.create({
      cliente_producto_id: parseInt(cliente_producto_id),
      archivo_nombre: file.originalname,
      registros_totales: parseResult.totalRows,
      registros_exitosos,
      registros_error: registros_error + parseResult.errors.length,
      errores_detalle: errores,
      usuario_id: (req as any).user.id,
      fecha: new Date(),
    });

    res.status(201).json({
      success: true,
      data: {
        importacion,
        resumen: {
          total: parseResult.totalRows,
          exitosos: registros_exitosos,
          errores: registros_error + parseResult.errors.length,
          lote: lote_carga,
        },
      },
      message: `Cartera procesada: ${registros_exitosos} cuentas importadas, ${registros_error + parseResult.errors.length} errores`,
    });
  } catch (error: any) {
    console.error('Error uploading cartera:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la cartera',
      error: error.message,
    });
  }
};

export const listImportaciones = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { count, rows } = await Importacion.findAndCountAll({
      include: [
        { model: ClienteProducto, as: 'clienteProducto', attributes: ['id', 'nombre', 'tipo'] },
      ],
      limit,
      offset: (page - 1) * limit,
      order: [['id', 'DESC']],
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
      message: 'OK',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al listar importaciones', error: error.message });
  }
};

export const getImportacion = async (req: Request, res: Response) => {
  try {
    const importacion = await Importacion.findByPk(req.params.id, {
      include: [
        { model: ClienteProducto, as: 'clienteProducto', attributes: ['id', 'nombre', 'tipo'] },
      ],
    });

    if (!importacion) {
      return res.status(404).json({ success: false, message: 'Importación no encontrada' });
    }

    res.json({ success: true, data: importacion, message: 'OK' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error', error: error.message });
  }
};
