import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import UsuariosController from '../controllers/Usuarios.controller';

const UsuariosRouter: Router = Router();

UsuariosRouter.route('/')
  .get(authenticate, UsuariosController.getAll)
  .post(authenticate, UsuariosController.create);  

UsuariosRouter.route('/:id')
  .get(authenticate, UsuariosController.getById)
  .patch(authenticate, UsuariosController.update)
  .delete(authenticate, UsuariosController.delete);

export default UsuariosRouter;