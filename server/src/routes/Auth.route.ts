import { Router } from 'express';
import { loginLimiter } from '../middlewares/Limiter.middleware';
import { authenticate } from '../middlewares/Auth.middleware';
import AuthController from '../controllers/Auth.controller';

const AuthRouter: Router = Router();

AuthRouter.post('/login', loginLimiter, AuthController.login);
AuthRouter.post('/refresh', authenticate, AuthController.refresh);
AuthRouter.post('/logout', authenticate, AuthController.logout);

export default AuthRouter;