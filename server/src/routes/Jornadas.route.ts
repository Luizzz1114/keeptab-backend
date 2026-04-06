import { Router } from 'express';
import JornadasController from '../controllers/Jornadas.controller';

const JornadasRouter: Router = Router();

JornadasRouter.get('/', JornadasController.getAll);  
JornadasRouter.post('/abrir', JornadasController.abrir);
JornadasRouter.get('/actual', JornadasController.getEstadoActual);
JornadasRouter.patch('/:id/cerrar', JornadasController.cerrar);

JornadasRouter.route('/:id')
  .get(JornadasController.getById)
  .delete(JornadasController.delete);

export default JornadasRouter;