import { Router } from 'express';
import { Request, Response } from 'express';
import { sendSuccess } from '../utils/responses';
import ProductosRouter from './Productos.route';
import ClientesRouter from './Clientes.route';
import VentasRouter from './Ventas.route';
import AbonosRouter from './Abonos.route';
import JornadasRouter from './Jornadas.route';
import UsuariosRouter from './Usuarios.route';
import AuthRouter from './Auth.route';

const router: Router = Router();

router.get('/', (_req: Request, res: Response) => {
  return sendSuccess(res, 200, null, 'API funcionando correctamente');
});

router.use('/auth', AuthRouter);
router.use('/usuarios', UsuariosRouter)
router.use('/productos', ProductosRouter);
router.use('/clientes', ClientesRouter);
router.use('/ventas', VentasRouter);
router.use('/abonos', AbonosRouter);
router.use('/jornadas', JornadasRouter);

export default router;