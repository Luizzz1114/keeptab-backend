import { Router } from 'express';
import JornadasController from '../controllers/Jornadas.controller';

const JornadasRouter: Router = Router();

JornadasRouter.route('/')
  .get(JornadasController.getAll)
  .post(JornadasController.abrir);  

JornadasRouter.route('/:id')
  .get(JornadasController.getById)
  .patch(JornadasController.cerrar)
  .delete(JornadasController.delete);

export default JornadasRouter;