import { Router } from 'express';
import { getGlobalReport, getClientReport, exportClientReport } from '../controllers/reportes.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

router.get('/gestion', getGlobalReport);
router.get('/cliente/:clienteId', getClientReport);
router.get('/exportar/:clienteId', exportClientReport);

export default router;
