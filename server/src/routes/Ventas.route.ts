import { Router } from 'express';
import VentasController from '../controllers/Ventas.controller';

const VentasRouter: Router = Router();

VentasRouter.route('/')
  .get(VentasController.getAll)
  .post(VentasController.create);  

VentasRouter.route('/:id')
  .get(VentasController.getById)
  .delete(VentasController.delete);

export default VentasRouter;