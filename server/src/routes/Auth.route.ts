import { Router } from 'express';
import { loginLimiter } from '../middlewares/limiter.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import AuthController from '../controllers/Auth.controller';
import UsuariosController from '../controllers/Usuarios.controller';

const AuthRouter: Router = Router();

AuthRouter.post('/create-user', UsuariosController.create);
AuthRouter.post('/login', loginLimiter, AuthController.login);
AuthRouter.post('/refresh', authenticate, AuthController.refresh);
AuthRouter.post('/logout', authenticate, AuthController.logout);

export default AuthRouter;