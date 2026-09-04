import { Router } from 'express';
import { uploadCartera, listImportaciones, getImportacion } from '../controllers/carteras.controller';
import { uploadDocument } from '../middleware/upload';
import { authMiddleware, roleGuard } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

router.post('/upload', roleGuard(['admin']), uploadDocument.single('archivo'), uploadCartera);
router.get('/importaciones', roleGuard(['admin']), listImportaciones);
router.get('/importaciones/:id', roleGuard(['admin']), getImportacion);

export default router;
