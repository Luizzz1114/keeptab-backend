import { Router } from 'express';
import ProductosController from '../controllers/Productos.controller';

const ProductosRouter: Router = Router();

ProductosRouter.route('/')
  .get(ProductosController.getAll)
  .post(ProductosController.create);  

ProductosRouter.route('/:id')
  .get(ProductosController.getById)
  .patch(ProductosController.update)
  .delete(ProductosController.delete);

export default ProductosRouter;