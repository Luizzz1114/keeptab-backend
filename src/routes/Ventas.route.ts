import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { validateBody, validateId } from '../middlewares/validator.middleware';
import { createVentaSchema } from '../schemas/Ventas.dto';
import VentasController from '../controllers/Ventas.controller';

const VentasRouter: Router = Router();

VentasRouter.use(authenticate);

VentasRouter.route('/')
  .get(VentasController.getAll)
  .post(validateBody(createVentaSchema), VentasController.create);

VentasRouter.route('/:id')
  .get(validateId('venta'), VentasController.getById)
  .delete(validateId('venta'), VentasController.delete);

export default VentasRouter;