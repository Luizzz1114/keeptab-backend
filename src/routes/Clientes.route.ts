import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { validateBody, validateId } from '../middlewares/validator.middleware';
import { createClienteSchema, updateClienteSchema } from '../schemas/Clientes.dto';
import ClientesController from '../controllers/Clientes.controller';

const ClientesRouter: Router = Router();

ClientesRouter.use(authenticate);

ClientesRouter.route('/')
  .get(ClientesController.getAll)
  .post(validateBody(createClienteSchema), ClientesController.create);  

ClientesRouter.route('/:id')
  .get(validateId('cliente'), ClientesController.getById)
  .patch(validateId('cliente'), validateBody(updateClienteSchema), ClientesController.update)
  .delete(validateId('cliente'), ClientesController.delete);

ClientesRouter.get('/:id/deudas', validateId('cliente'), ClientesController.getDeudas);

export default ClientesRouter;