import { Router } from 'express';
import AbonosController from '../controllers/Abonos.controller';

const AbonosRouter: Router = Router();

AbonosRouter.route('/')
  .get(AbonosController.getAll)
  .post(AbonosController.create);  

AbonosRouter.route('/:id')
  .get(AbonosController.getById)
  .delete(AbonosController.delete);

export default AbonosRouter;