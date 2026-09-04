import { Request, Response } from 'express';
import { Gestion } from '../models/Gestion';
import { Evidencia } from '../models/Evidencia';
import { Op } from 'sequelize';

export const createGestion = async (req: Request, res: Response) => {
  try {
    const { cuenta_id, latitud, longitud, precision_gps, codigo_cierre, resultado, notas, tipo_contacto, fecha_gestion } = req.body;
    const comisionista_id = (req as any).user.comisionista_id || req.body.comisionista_id;
    
    const gestion = await Gestion.create({
      cuenta_id, comisionista_id, latitud, longitud, precision_gps, codigo_cierre, resultado, notas, tipo_contacto, fecha_gestion
    });
    res.status(201).json({ success: true, data: gestion, message: 'Gestión creada' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error', error: error.message });
  }
};

export const uploadEvidencias = async (req: Request, res: Response) => {
  try {
    const gestion_id = req.params.id;
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) return res.status(400).json({ success: false, message: 'No hay archivos' });
    
    const evidencias = await Promise.all(files.map(f => Evidencia.create({
      gestion_id: parseInt(gestion_id),
      tipo: f.mimetype.startsWith('video') ? 'Video' : 'Foto',
      url: f.path,
      nombre_archivo: f.originalname
    })));
    
    res.json({ success: true, data: evidencias, message: 'Evidencias subidas' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error', error: error.message });
  }
};

export const getGestionesByCuenta = async (req: Request, res: Response) => {
  try {
    const gestiones = await Gestion.findAll({ where: { cuenta_id: req.params.cuentaId }, order: [['fecha_gestion', 'DESC']] });
    res.json({ success: true, data: gestiones, message: 'Gestiones obtenidas' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error', error: error.message });
  }
};

export const getGestionesByComisionista = async (req: Request, res: Response) => {
  try {
    const gestiones = await Gestion.findAll({ where: { comisionista_id: req.params.comisionistaId }, order: [['fecha_gestion', 'DESC']] });
    res.json({ success: true, data: gestiones, message: 'Gestiones obtenidas' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error', error: error.message });
  }
};
