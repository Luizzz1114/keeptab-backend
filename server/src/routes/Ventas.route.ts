import { Router } from 'express';
import { authenticate } from '../middlewares/Auth.middleware';
import VentasController from '../controllers/Ventas.controller';

const VentasRouter: Router = Router();

VentasRouter.route('/')
  .get(authenticate, VentasController.getAll)
  .post(authenticate, VentasController.create);  

VentasRouter.route('/:id')
  .get(authenticate, VentasController.getById)
  .delete(authenticate, VentasController.delete);

export default VentasRouter;