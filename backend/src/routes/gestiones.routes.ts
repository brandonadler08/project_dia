import { Router } from 'express';
import { createGestion, uploadEvidencias, getGestionesByCuenta, getGestionesByComisionista } from '../controllers/gestiones.controller';
import { uploadMedia } from '../middleware/upload';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

router.post('/', createGestion);
router.post('/:id/evidencias', uploadMedia.array('evidencias', 5), uploadEvidencias);
router.get('/cuenta/:cuentaId', getGestionesByCuenta);
router.get('/comisionista/:comisionistaId', getGestionesByComisionista);

export default router;
