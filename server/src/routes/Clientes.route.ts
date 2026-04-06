import { Router } from 'express';
import ClientesController from '../controllers/Clientes.controller';

const ClientesRouter: Router = Router();

ClientesRouter.route('/')
  .get(ClientesController.getAll)
  .post(ClientesController.create);  

ClientesRouter.route('/:id')
  .get(ClientesController.getById)
  .patch(ClientesController.update)
  .delete(ClientesController.delete);

ClientesRouter.get('/:id/deudas', ClientesController.getDeudas);

export default ClientesRouter;