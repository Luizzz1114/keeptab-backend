import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import ProductosController from '../controllers/Productos.controller';

const ProductosRouter: Router = Router();

ProductosRouter.route('/')
  .get(authenticate, ProductosController.getAll)
  .post(authenticate, ProductosController.create);  

ProductosRouter.route('/:id')
  .get(authenticate, ProductosController.getById)
  .patch(authenticate, ProductosController.update)
  .delete(authenticate, ProductosController.delete);

export default ProductosRouter;