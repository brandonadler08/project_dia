import { Router } from 'express';
import { 
  listCuentas, 
  getSinAsignar, 
  getCuenta, 
  asignarCuentas,
  getOfertasDisponibles,
  publicarOferta,
  aceptarOferta,
  calcularRutas,
  getMiAvance
} from '../controllers/cuentas.controller';
import { authMiddleware, roleGuard } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

// Cuentas generales
router.get('/', listCuentas);
router.get('/sin-asignar', getSinAsignar);
router.get('/ofertas', getOfertasDisponibles);
router.get('/mi-avance', getMiAvance);
router.post('/calcular-rutas', calcularRutas);
router.get('/:id', getCuenta);

// Acciones Admin / Gestor
router.post('/asignar', roleGuard(['admin', 'analista']), asignarCuentas);
router.post('/:id/ofertar', roleGuard(['admin', 'analista']), publicarOferta);
router.post('/:id/aceptar-oferta', aceptarOferta);

export default router;
