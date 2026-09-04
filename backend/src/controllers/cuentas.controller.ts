import { Request, Response } from 'express';
import { Cuenta, ClienteProducto, Comisionista, Gestion, Usuario } from '../models';
import { Op } from 'sequelize';

// Haversine distance calculator in Kilometers
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth radius in KM
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Rounded to 1 decimal
};

export const listCuentas = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    
    const { cliente_producto_id, comisionista_id, estatus, bucket, estado, municipio, search, en_oferta } = req.query;
    const where: any = {};
    
    if (cliente_producto_id) where.cliente_producto_id = cliente_producto_id;
    if (comisionista_id) where.comisionista_id = comisionista_id;
    if (estatus) where.estatus = estatus;
    if (bucket) where.bucket = bucket;
    if (estado) where.estado = estado;
    if (municipio) where.municipio = municipio;
    if (en_oferta !== undefined) where.en_oferta = en_oferta === 'true' || en_oferta === '1';
    
    if (search) {
      where[Op.or] = [
        { identificador_externo: { [Op.like]: `%${search}%` } },
        { nombre_titular: { [Op.like]: `%${search}%` } },
        { municipio: { [Op.like]: `%${search}%` } }
      ];
    }
    
    const { count, rows } = await Cuenta.findAndCountAll({
      where,
      include: [
        { model: ClienteProducto, as: 'clienteProducto', attributes: ['id', 'nombre', 'tipo'] },
        { model: Comisionista, as: 'comisionista', attributes: ['id', 'nombre', 'numero_identificacion'] }
      ],
      limit,
      offset,
      order: [['id', 'DESC']]
    });
    
    res.json({
      success: true,
      data: rows,
      message: 'Cuentas obtenidas',
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error', error: error.message });
  }
};

export const getSinAsignar = async (req: Request, res: Response) => {
  try {
    const results = await Cuenta.findAll({
      attributes: ['cliente_producto_id', [Cuenta.sequelize!.fn('COUNT', Cuenta.sequelize!.col('Cuenta.id')), 'total']],
      where: { comisionista_id: null },
      include: [{ model: ClienteProducto, as: 'clienteProducto', attributes: ['nombre'] }],
      group: ['cliente_producto_id', 'clienteProducto.id'],
      raw: true,
      nest: true,
    });
    res.json({ success: true, data: results, message: 'Cuentas sin asignar' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error', error: error.message });
  }
};

export const getCuenta = async (req: Request, res: Response) => {
  try {
    const cuenta = await Cuenta.findByPk(req.params.id, {
      include: [
        { model: ClienteProducto, as: 'clienteProducto' },
        { model: Comisionista, as: 'comisionista' },
        { model: Gestion, as: 'gestiones', include: ['evidencias'] }
      ]
    });
    if (!cuenta) return res.status(404).json({ success: false, message: 'Cuenta no encontrada' });
    res.json({ success: true, data: cuenta, message: 'Cuenta obtenida' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error', error: error.message });
  }
};

export const asignarCuentas = async (req: Request, res: Response) => {
  try {
    const { cuenta_ids, comisionista_id } = req.body;
    if (!Array.isArray(cuenta_ids) || !comisionista_id) {
      return res.status(400).json({ success: false, message: 'Datos incompletos' });
    }
    
    await Cuenta.update(
      { comisionista_id, en_oferta: false, fecha_asignacion: new Date() },
      { where: { id: { [Op.in]: cuenta_ids } } }
    );
    
    res.json({ success: true, data: null, message: `${cuenta_ids.length} cuentas asignadas exitosamente` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al asignar cuentas', error: error.message });
  }
};

// ========== UBER-STYLE COMMISSION MARKETPLACE ==========

export const getOfertasDisponibles = async (req: Request, res: Response) => {
  try {
    const { latitud, longitud } = req.query;
    
    const ofertas = await Cuenta.findAll({
      where: {
        en_oferta: true,
        comisionista_id: null
      },
      include: [
        { model: ClienteProducto, as: 'clienteProducto', attributes: ['id', 'nombre', 'tipo'] }
      ],
      order: [['comision_oferta', 'DESC']]
    });

    let ofertasFormatted = ofertas.map((o: any) => {
      const plain = o.toJSON();
      if (latitud && longitud && plain.latitud && plain.longitud) {
        plain.distancia_km = calculateDistance(
          parseFloat(latitud as string),
          parseFloat(longitud as string),
          parseFloat(plain.latitud),
          parseFloat(plain.longitud)
        );
      } else {
        plain.distancia_km = Math.round((Math.random() * 12 + 1.2) * 10) / 10;
      }
      return plain;
    });

    // Sort by distance if GPS is available
    if (latitud && longitud) {
      ofertasFormatted.sort((a, b) => (a.distancia_km || 999) - (b.distancia_km || 999));
    }

    res.json({
      success: true,
      data: ofertasFormatted,
      message: `${ofertasFormatted.length} ofertas de recolección disponibles`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al obtener ofertas', error: error.message });
  }
};

export const publicarOferta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { comision_oferta } = req.body;

    const cuenta = await Cuenta.findByPk(id);
    if (!cuenta) return res.status(404).json({ success: false, message: 'Cuenta no encontrada' });

    await cuenta.update({
      en_oferta: true,
      comision_oferta: comision_oferta || 250,
      comisionista_id: null
    });

    res.json({ success: true, data: cuenta, message: 'Oferta de recolección publicada exitosamente' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al publicar oferta', error: error.message });
  }
};

export const aceptarOferta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    
    // Find comisionista for current user
    let comisionistaId = user?.comisionista_id;
    if (!comisionistaId) {
      const primerComisionista = await Comisionista.findOne();
      comisionistaId = primerComisionista?.id || 1;
    }

    const cuenta = await Cuenta.findOne({
      where: { id, en_oferta: true, comisionista_id: null }
    });

    if (!cuenta) {
      return res.status(400).json({
        success: false,
        message: 'Esta oferta ya fue aceptada por otro gestor o no está disponible'
      });
    }

    await cuenta.update({
      comisionista_id: comisionistaId,
      en_oferta: false,
      fecha_asignacion: new Date()
    });

    res.json({
      success: true,
      data: cuenta,
      message: `¡Oferta aceptada! Se ha asignado a tu ruta con comisión de $${cuenta.comision_oferta} MXN`
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al aceptar oferta', error: error.message });
  }
};

// ========== INTELLIGENT ROUTING & PROXIMITY ==========

export const calcularRutas = async (req: Request, res: Response) => {
  try {
    const { latitud, longitud, comisionista_id } = req.body;
    const user = (req as any).user;
    const comId = comisionista_id || user?.comisionista_id || 1;

    const cuentas = await Cuenta.findAll({
      where: {
        comisionista_id: comId,
        estatus: 'Activa'
      },
      include: [
        { model: ClienteProducto, as: 'clienteProducto', attributes: ['id', 'nombre', 'tipo'] }
      ]
    });

    const userLat = parseFloat(latitud) || 19.4326; // Default to CDMX center
    const userLng = parseFloat(longitud) || -99.1332;

    const cuentasConDistancia = cuentas.map((c: any) => {
      const plain = c.toJSON();
      const cLat = plain.latitud ? parseFloat(plain.latitud) : userLat + (Math.random() - 0.5) * 0.08;
      const cLng = plain.longitud ? parseFloat(plain.longitud) : userLng + (Math.random() - 0.5) * 0.08;
      
      const distancia_km = calculateDistance(userLat, userLng, cLat, cLng);
      plain.latitud = cLat;
      plain.longitud = cLng;
      plain.distancia_km = distancia_km;
      plain.tiempo_estimado_min = Math.round(distancia_km * 3.5); // ~20 km/h in city traffic
      return plain;
    });

    // Sort by closest distance
    cuentasConDistancia.sort((a, b) => a.distancia_km - b.distancia_km);

    const paradaRecomendada = cuentasConDistancia.length > 0 ? cuentasConDistancia[0] : null;

    res.json({
      success: true,
      data: {
        ubicacion_actual: { latitud: userLat, longitud: userLng },
        siguiente_parada: paradaRecomendada,
        cuentas_ordenadas: cuentasConDistancia,
        total_paradas: cuentasConDistancia.length
      },
      message: 'Ruta optimizada calculada'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al calcular rutas', error: error.message });
  }
};

// ========== GESTOR PROGRESS & EARNINGS ==========

export const getMiAvance = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const comisionistaId = user?.comisionista_id || 1;

    const comisionista = await Comisionista.findByPk(comisionistaId);
    
    // Cuentas asignadas
    const totalAsignadas = await Cuenta.count({ where: { comisionista_id: comisionistaId } });
    const activas = await Cuenta.count({ where: { comisionista_id: comisionistaId, estatus: 'Activa' } });
    
    // Gestiones
    const totalGestiones = await Gestion.count({ where: { comisionista_id: comisionistaId } });
    const exitosas = await Gestion.count({ where: { comisionista_id: comisionistaId, resultado: 'Exitoso' } });
    
    // Comisiones estimadas ganadas (promedio $350 por visita exitosa)
    const comisionesGanadas = exitosas * 350;
    const metaSemanal = 25; // 25 visitas semanales
    const porcentajeMeta = Math.min(Math.round((totalGestiones / metaSemanal) * 100), 100);

    res.json({
      success: true,
      data: {
        comisionista: comisionista?.nombre || 'Gestor de Campo',
        numero_identificacion: comisionista?.numero_identificacion || 'COM-0001',
        metricas: {
          comisiones_acumuladas: comisionesGanadas,
          visitas_completadas_hoy: totalGestiones,
          visitas_exitosas: exitosas,
          cuentas_pendientes: activas,
          total_asignadas: totalAsignadas,
          tasa_efectividad: totalGestiones > 0 ? Math.round((exitosas / totalGestiones) * 100) : 0,
          meta_semanal: metaSemanal,
          porcentaje_meta: porcentajeMeta
        }
      },
      message: 'Avance del gestor obtenido'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error al obtener avance', error: error.message });
  }
};
