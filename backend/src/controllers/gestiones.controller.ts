import { Request, Response } from 'express';
import { Gestion, Cuenta, ClienteProducto, Comisionista, Evidencia } from '../models';

export const createGestion = async (req: Request, res: Response) => {
  try {
    const { 
      cuenta_id, 
      latitud, 
      longitud, 
      precision_gps, 
      codigo_cierre, 
      codigo_resultado,
      resultado, 
      notas, 
      observaciones,
      tipo_contacto, 
      fecha_gestion,
      tiene_video,
      total_fotos 
    } = req.body;
    
    const comisionista_id = (req as any).user?.comisionista_id || req.body.comisionista_id || 1;
    
    const gestion = await Gestion.create({
      cuenta_id: cuenta_id || 1,
      comisionista_id,
      latitud: latitud || 19.4085,
      longitud: longitud || -99.1628,
      precision_gps: precision_gps || 4.2,
      codigo_cierre: codigo_cierre || codigo_resultado || 'Contacto Exitoso',
      resultado: resultado || (req.body.contacto_exitoso !== false ? 'Exitoso' : 'No Exitoso'),
      notas: notas || observaciones || 'Gestión en campo registrada con geolocalización',
      tipo_contacto: tipo_contacto || 'Presencial',
      fecha_gestion: fecha_gestion || new Date(),
    });

    res.status(201).json({ success: true, data: gestion, message: 'Gestión registrada exitosamente' });
  } catch (error: any) {
    console.error('Error al crear gestión:', error);
    res.status(500).json({ success: false, message: 'Error', error: error.message });
  }
};

export const getAllGestiones = async (req: Request, res: Response) => {
  try {
    const gestiones = await Gestion.findAll({
      order: [['fecha_gestion', 'DESC'], ['id', 'DESC']],
      limit: 50,
      include: [
        {
          model: Cuenta,
          as: 'cuenta',
          include: [{ model: ClienteProducto, as: 'clienteProducto' }],
        },
        {
          model: Comisionista,
          as: 'comisionista',
        },
        {
          model: Evidencia,
          as: 'evidencias',
        },
      ],
    });

    res.json({ success: true, data: gestiones, message: 'Gestiones obtenidas' });
  } catch (error: any) {
    console.error('Error al obtener gestiones:', error);
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
