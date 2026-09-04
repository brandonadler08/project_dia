import { Router } from 'express';
import { login, refresh } from '../controllers/auth.controller';
import { body } from 'express-validator';

const router = Router();

router.post('/login', [
  body('email').isEmail().withMessage('Debe ser un email válido'),
  body('password').notEmpty().withMessage('Contraseña requerida')
], login);

router.post('/refresh', [
  body('token').notEmpty().withMessage('Refresh token requerido')
], refresh);

export default router;
