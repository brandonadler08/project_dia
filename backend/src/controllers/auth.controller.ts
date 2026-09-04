import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario';
import { authConfig } from '../config/auth';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await Usuario.findOne({ where: { email, activo: true } });
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
    
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
    
    const token = (jwt as any).sign({ id: user.id, rol: user.rol }, authConfig.secret, { expiresIn: authConfig.expiresIn });
    const refreshToken = (jwt as any).sign({ id: user.id }, authConfig.secret, { expiresIn: authConfig.refreshExpiresIn });
    
    return res.json({ success: true, data: { user, token, refreshToken }, message: 'Login exitoso' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error interno', error: error.message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: 'Token requerido' });
    
    const decoded: any = jwt.verify(token, authConfig.secret);
    const user = await Usuario.findByPk(decoded.id);
    
    if (!user || !user.activo) {
      return res.status(401).json({ success: false, message: 'Usuario no encontrado o inactivo' });
    }
    
    const newToken = (jwt as any).sign({ id: user.id, rol: user.rol }, authConfig.secret, { expiresIn: authConfig.expiresIn });
    return res.json({ success: true, data: { token: newToken }, message: 'Token renovado' });
  } catch (error: any) {
    return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
};
