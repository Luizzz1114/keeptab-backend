import { Router } from 'express';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';
import { validateBody, validateId } from '../middlewares/validator.middleware';
import { abrirJornadaSchema, cerrarJornadaSchema } from '../schemas/Jornadas.dto';
import JornadasController from '../controllers/Jornadas.controller';

const JornadasRouter: Router = Router();

JornadasRouter.use(authenticate);

JornadasRouter.get('/', JornadasController.getAll); 
JornadasRouter.get('/actual', JornadasController.getEstadoActual);
JornadasRouter.get('/:id', validateId('jornada'), JornadasController.getById);

JornadasRouter.use(isAdmin);

JornadasRouter.post('/abrir', validateBody(abrirJornadaSchema), JornadasController.abrir);
JornadasRouter.patch('/:id/cerrar', validateId('jornada'), validateBody(cerrarJornadaSchema), JornadasController.cerrar);
JornadasRouter.delete('/:id', validateId('jornada'), JornadasController.delete);

export default JornadasRouter;