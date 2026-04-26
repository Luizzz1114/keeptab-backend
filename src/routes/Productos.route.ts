import { Router } from 'express';
import { validateBody, validateId } from '../middlewares/validator.middleware';
import { createProductoSchema, updateProductoSchema } from '../schemas/Productos.dto';
import ProductosController from '../controllers/Productos.controller';

const ProductosRouter: Router = Router();

ProductosRouter.route('/')
  .get(ProductosController.getAll)
  .post(validateBody(createProductoSchema), ProductosController.create);  

ProductosRouter.route('/:id')
  .get(validateId('producto'), ProductosController.getById)
  .patch(validateId('producto'), validateBody(updateProductoSchema), ProductosController.update)
  .delete(validateId('producto'), ProductosController.delete);

export default ProductosRouter;