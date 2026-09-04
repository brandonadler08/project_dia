import { Router } from 'express';
import { 
  listComisionistas, getComisionista, createComisionista, 
  updateComisionista, updateEstatus, getMunicipios, updateMunicipios 
} from '../controllers/comisionistas.controller';
import { uploadDocument } from '../middleware/upload';
import { authMiddleware, roleGuard } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', listComisionistas);
router.get('/:id', getComisionista);
router.post('/', roleGuard(['admin', 'analista']), uploadDocument.fields([{ name: 'ine_frente', maxCount: 1 }, { name: 'ine_reverso', maxCount: 1 }]), createComisionista);
router.put('/:id', roleGuard(['admin', 'analista']), updateComisionista);
router.patch('/:id/estatus', roleGuard(['admin', 'analista']), updateEstatus);
router.get('/:id/municipios', getMunicipios);
router.put('/:id/municipios', roleGuard(['admin', 'analista']), updateMunicipios);

export default router;
