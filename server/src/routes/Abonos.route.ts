import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { validateBody, validateId } from '../middlewares/validator.middleware';
import { createAbonoSchema } from '../schemas/Abonos.dto';
import AbonosController from '../controllers/Abonos.controller';

const AbonosRouter: Router = Router();

AbonosRouter.route('/')
  .get(authenticate, AbonosController.getAll)
  .post(authenticate, validateBody(createAbonoSchema), AbonosController.create);

AbonosRouter.route('/:id')
  .get(authenticate, validateId('abono'), AbonosController.getById)
  .delete(authenticate, validateId('abono'), AbonosController.delete);

export default AbonosRouter;