import { Request, Response } from 'express';
import { Comisionista } from '../models/Comisionista';
import { ReferenciaComisionista } from '../models/ReferenciaComisionista';
import { Op } from 'sequelize';

export const listComisionistas = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    
    const { nombre, estatus } = req.query;
    const where: any = {};
    if (nombre) where.nombre = { [Op.iLike]: `%${nombre}%` };
    if (estatus) where.estatus = estatus;
    
    const { count, rows } = await Comisionista.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']]
    });
    
    res.json({
      success: true,
      data: rows,
      message: 'Comisionistas obtenidos',
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error', error: error.message });
  }
};

export const getComisionista = async (req: Request, res: Response) => {
  try {
    const comisionista = await Comisionista.findByPk(req.params.id);
    if (!comisionista) return res.status(404).json({ success: false, message: 'No encontrado' });
    
    const referencias = await ReferenciaComisionista.findAll({ where: { comisionista_id: comisionista.id } });
    
    res.json({ success: true, data: { ...comisionista.toJSON(), referencias }, message: 'OK' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error', error: error.message });
  }
};

export const createComisionista = async (req: Request, res: Response) => {
  try {
    const { numero_identificacion, nombre, direccion } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    const urls: any = {};
    if (files) {
      if (files['ine_frente']) urls.ine_frente_url = files['ine_frente'][0].path;
      if (files['ine_reverso']) urls.ine_reverso_url = files['ine_reverso'][0].path;
    }
    
    const comisionista = await Comisionista.create({
      numero_identificacion, nombre, direccion, ...urls
    });
    
    res.status(201).json({ success: true, data: comisionista, message: 'Creado exitosamente' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error', error: error.message });
  }
};

export const updateComisionista = async (req: Request, res: Response) => {
  try {
    const comisionista = await Comisionista.findByPk(req.params.id);
    if (!comisionista) return res.status(404).json({ success: false, message: 'No encontrado' });
    
    await comisionista.update(req.body);
    res.json({ success: true, data: comisionista, message: 'Actualizado' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error', error: error.message });
  }
};

export const updateEstatus = async (req: Request, res: Response) => {
  try {
    const comisionista = await Comisionista.findByPk(req.params.id);
    if (!comisionista) return res.status(404).json({ success: false, message: 'No encontrado' });
    
    await comisionista.update({ estatus: req.body.estatus });
    res.json({ success: true, data: comisionista, message: 'Estatus actualizado' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error', error: error.message });
  }
};

export const getMunicipios = async (req: Request, res: Response) => {
  try {
    const comisionista = await Comisionista.findByPk(req.params.id);
    if (!comisionista) return res.status(404).json({ success: false, message: 'No encontrado' });
    res.json({ success: true, data: comisionista.municipios_alcance, message: 'Municipios obtenidos' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error', error: error.message });
  }
};

export const updateMunicipios = async (req: Request, res: Response) => {
  try {
    const comisionista = await Comisionista.findByPk(req.params.id);
    if (!comisionista) return res.status(404).json({ success: false, message: 'No encontrado' });
    
    await comisionista.update({ municipios_alcance: req.body.municipios_alcance });
    res.json({ success: true, data: comisionista.municipios_alcance, message: 'Municipios actualizados' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error', error: error.message });
  }
};
