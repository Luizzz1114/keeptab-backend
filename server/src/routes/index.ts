import { Router } from 'express';
import { Request, Response } from 'express';
import ProductosRouter from './Productos.route';
import ClientesRouter from './Clientes.route';
import VentasRouter from './Ventas.route';
import AbonosRouter from './Abonos.route';
import JornadasRouter from './Jornadas.route';

const router: Router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.send('API funcionando correctamente');
});

router.use('/productos', ProductosRouter);
router.use('/clientes', ClientesRouter);
router.use('/ventas', VentasRouter);
router.use('/abonos', AbonosRouter);
router.use('/jornadas', JornadasRouter);

export default router;