import { Request, Response } from 'express';
import { Gestion } from '../models/Gestion';
import { Cuenta } from '../models/Cuenta';
import { Op } from 'sequelize';
import xlsx from 'xlsx';

export const getGlobalReport = async (req: Request, res: Response) => {
  try {
    const { fecha_inicio, fecha_fin, cliente_id, comisionista_id } = req.query;
    const where: any = {};
    if (fecha_inicio && fecha_fin) where.fecha_gestion = { [Op.between]: [fecha_inicio, fecha_fin] };
    if (comisionista_id) where.comisionista_id = comisionista_id;
    
    // In production, include Cuenta to filter by cliente_id
    const data = await Gestion.findAll({ where });
    res.json({ success: true, data, message: 'Reporte global' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error', error: error.message });
  }
};

export const getClientReport = async (req: Request, res: Response) => {
  try {
    const { clienteId } = req.params;
    const cuentas = await Cuenta.findAll({ where: { cliente_producto_id: clienteId } });
    res.json({ success: true, data: cuentas, message: 'Reporte cliente' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error', error: error.message });
  }
};

export const exportClientReport = async (req: Request, res: Response) => {
  try {
    const { clienteId } = req.params;
    const cuentas = await Cuenta.findAll({ where: { cliente_producto_id: clienteId }, raw: true });
    
    const ws = xlsx.utils.json_to_sheet(cuentas);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Reporte');
    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Disposition', `attachment; filename="reporte_cliente_${clienteId}.xlsx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error', error: error.message });
  }
};
