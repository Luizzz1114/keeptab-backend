import { Router } from 'express';
import { authenticate } from '../middlewares/Auth.middleware';
import ClientesController from '../controllers/Clientes.controller';

const ClientesRouter: Router = Router();

ClientesRouter.route('/')
  .get(authenticate, ClientesController.getAll)
  .post(authenticate, ClientesController.create);  

ClientesRouter.route('/:id')
  .get(authenticate, ClientesController.getById)
  .patch(authenticate, ClientesController.update)
  .delete(authenticate, ClientesController.delete);

ClientesRouter.get('/:id/deudas', authenticate, ClientesController.getDeudas);

export default ClientesRouter;