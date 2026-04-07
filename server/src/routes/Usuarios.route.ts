import { Router } from 'express';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';
import UsuariosController from '../controllers/Usuarios.controller';

const UsuariosRouter: Router = Router();

UsuariosRouter.get('/me', authenticate, UsuariosController.getMe);

UsuariosRouter.route('/')
  .get(authenticate, isAdmin, UsuariosController.getAll)
  .post(authenticate, isAdmin, UsuariosController.create);  

UsuariosRouter.route('/:id')
  .get(authenticate, isAdmin, UsuariosController.getById)
  .patch(authenticate, isAdmin, UsuariosController.update)
  .delete(authenticate, isAdmin, UsuariosController.delete);

export default UsuariosRouter;