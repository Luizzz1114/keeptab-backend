import { Router } from 'express';
import { validateBody, validateId } from '../middlewares/validator.middleware';
import { createAbonoSchema } from '../schemas/Abonos.dto';
import AbonosController from '../controllers/Abonos.controller';

const AbonosRouter: Router = Router();

AbonosRouter.route('/')
  .get(AbonosController.getAll)
  .post(validateBody(createAbonoSchema), AbonosController.create);

AbonosRouter.route('/:id')
  .get(validateId('abono'), AbonosController.getById)
  .delete(validateId('abono'), AbonosController.delete);

export default AbonosRouter;