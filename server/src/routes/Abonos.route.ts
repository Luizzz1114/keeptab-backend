import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import AbonosController from '../controllers/Abonos.controller';

const AbonosRouter: Router = Router();

AbonosRouter.route('/')
  .get(authenticate, AbonosController.getAll)
  .post(authenticate, AbonosController.create);  

AbonosRouter.route('/:id')
  .get(authenticate, AbonosController.getById)
  .delete(authenticate, AbonosController.delete);

export default AbonosRouter;