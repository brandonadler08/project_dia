import { Router } from 'express';
import { createGestion, getAllGestiones, uploadEvidencias, getGestionesByCuenta, getGestionesByComisionista } from '../controllers/gestiones.controller';
import { uploadMedia } from '../middleware/upload';

const router = Router();

// Permitir crear y leer gestiones
router.post('/', createGestion);
router.get('/', getAllGestiones);
router.post('/:id/evidencias', uploadMedia.array('evidencias', 5), uploadEvidencias);
router.get('/cuenta/:cuentaId', getGestionesByCuenta);
router.get('/comisionista/:comisionistaId', getGestionesByComisionista);

export default router;
