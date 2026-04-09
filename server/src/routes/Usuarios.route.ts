import { Router } from 'express';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';
import { validateBody, validateId } from '../middlewares/validator.middleware';
import { createUsuarioSchema, updateUsuarioSchema } from '../schemas/Usuarios.dto';
import UsuariosController from '../controllers/Usuarios.controller';

const UsuariosRouter: Router = Router();

UsuariosRouter.use(authenticate);

UsuariosRouter.get('/me', UsuariosController.getMe);

UsuariosRouter.use(isAdmin);

UsuariosRouter.route('/')
  .get(UsuariosController.getAll)
  .post(validateBody(createUsuarioSchema), UsuariosController.create);  

UsuariosRouter.route('/:id')
  .get(validateId('usuario'), UsuariosController.getById)
  .patch(validateId('usuario'), validateBody(updateUsuarioSchema), UsuariosController.update)
  .delete(validateId('usuario'), UsuariosController.delete);

export default UsuariosRouter;