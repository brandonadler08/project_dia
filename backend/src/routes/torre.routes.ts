import { Router } from 'express';
import { getDashboardKPIs, createSeguimiento, getSeguimientosByCuenta } from '../controllers/torre.controller';
import { authMiddleware, roleGuard } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

router.get('/dashboard', roleGuard(['admin', 'analista']), getDashboardKPIs);
router.post('/seguimiento', roleGuard(['admin', 'analista']), createSeguimiento);
router.get('/seguimientos/:cuentaId', roleGuard(['admin', 'analista']), getSeguimientosByCuenta);

export default router;
