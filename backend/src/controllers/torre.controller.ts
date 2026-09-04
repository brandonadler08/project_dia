import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Cuenta, Gestion, SeguimientoTorre, ClienteProducto, Comisionista, Usuario } from '../models';

export const getDashboardKPIs = async (req: Request, res: Response) => {
  try {
    const total_cuentas = await Cuenta.count();
    const cuentas_asignadas = await Cuenta.count({
      where: { comisionista_id: { [Op.ne]: null } },
    });
    const sin_asignar = total_cuentas - cuentas_asignadas;

    // Date ranges
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    monthAgo.setHours(0, 0, 0, 0);

    const gestiones_hoy = await Gestion.count({
      where: { fecha_gestion: { [Op.between]: [today, endOfDay] } },
    });

    const gestiones_semana = await Gestion.count({
      where: { fecha_gestion: { [Op.gte]: weekAgo } },
    });

    const gestiones_mes = await Gestion.count({
      where: { fecha_gestion: { [Op.gte]: monthAgo } },
    });

    const exito_mes = await Gestion.count({
      where: {
        fecha_gestion: { [Op.gte]: monthAgo },
        resultado: 'Exitoso',
      },
    });

    const tasa_exito = gestiones_mes > 0 ? Math.round((exito_mes / gestiones_mes) * 100) : 0;

    // Sin comisionista por cliente
    const sin_comisionista_por_cliente = await Cuenta.findAll({
      attributes: [
        'cliente_producto_id',
        [Cuenta.sequelize!.fn('COUNT', Cuenta.sequelize!.col('Cuenta.id')), 'count'],
      ],
      where: { comisionista_id: null },
      include: [
        { model: ClienteProducto, as: 'clienteProducto', attributes: ['nombre'] },
      ],
      group: ['cliente_producto_id', 'clienteProducto.id'],
      raw: true,
      nest: true,
    });

    res.json({
      success: true,
      data: {
        total_cuentas,
        cuentas_asignadas,
        sin_asignar,
        gestiones_hoy,
        gestiones_semana,
        gestiones_mes,
        tasa_exito,
        sin_comisionista_por_cliente,
      },
      message: 'KPIs obtenidos',
    });
  } catch (error: any) {
    console.error('Error getting dashboard KPIs:', error);
    res.status(500).json({ success: false, message: 'Error al obtener KPIs', error: error.message });
  }
};

export const createSeguimiento = async (req: Request, res: Response) => {
  try {
    const { cuenta_id, comentario, accion } = req.body;

    if (!cuenta_id || !comentario) {
      return res.status(400).json({ success: false, message: 'cuenta_id y comentario son requeridos' });
    }

    const cuenta = await Cuenta.findByPk(cuenta_id);
    if (!cuenta) {
      return res.status(404).json({ success: false, message: 'Cuenta no encontrada' });
    }

    const analista_id = (req as any).user.id;

    const seguimiento = await SeguimientoTorre.create({
      cuenta_id,
      analista_id,
      comentario,
      accion: accion || null,
      fecha: new Date(),
    });

    res.status(201).json({ success: true, data: seguimiento, message: 'Seguimiento creado exitosamente' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al crear seguimiento', error: error.message });
  }
};

export const getSeguimientosByCuenta = async (req: Request, res: Response) => {
  try {
    const { cuentaId } = req.params;

    const seguimientos = await SeguimientoTorre.findAll({
      where: { cuenta_id: cuentaId },
      include: [
        { model: Usuario, as: 'analista', attributes: ['id', 'nombre', 'email'] },
      ],
      order: [['fecha', 'DESC']],
    });

    res.json({ success: true, data: seguimientos, message: 'Seguimientos obtenidos' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error', error: error.message });
  }
};
