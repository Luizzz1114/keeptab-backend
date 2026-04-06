import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import JornadasController from '../controllers/Jornadas.controller';

const JornadasRouter: Router = Router();

JornadasRouter.get('/', authenticate, JornadasController.getAll);  
JornadasRouter.post('/abrir', authenticate, JornadasController.abrir);
JornadasRouter.get('/actual', authenticate, JornadasController.getEstadoActual);
JornadasRouter.patch('/:id/cerrar', authenticate, JornadasController.cerrar);

JornadasRouter.route('/:id')
  .get(authenticate, JornadasController.getById)
  .delete(authenticate, JornadasController.delete);

export default JornadasRouter;