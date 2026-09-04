import { Router } from 'express';
import authRoutes from './auth.routes';
import comisionistasRoutes from './comisionistas.routes';
import cuentasRoutes from './cuentas.routes';
import carterasRoutes from './carteras.routes';
import gestionesRoutes from './gestiones.routes';
import torreRoutes from './torre.routes';
import reportesRoutes from './reportes.routes';
import { authMiddleware, roleGuard } from '../middleware/auth';

const router = Router();

router.use('/auth', authRoutes);
router.use('/comisionistas', comisionistasRoutes); // Auth and roles handled inside
router.use('/cuentas', cuentasRoutes);
router.use('/carteras', carterasRoutes);
router.use('/gestiones', gestionesRoutes);
router.use('/torre', torreRoutes);
router.use('/reportes', reportesRoutes);

export default router;
