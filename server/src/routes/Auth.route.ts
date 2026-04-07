import { Router } from 'express';
import { loginLimiter } from '../middlewares/limiter.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import AuthController from '../controllers/Auth.controller';

const AuthRouter: Router = Router();

AuthRouter.post('/set-admin', loginLimiter, AuthController.setAdmin);
AuthRouter.post('/login', loginLimiter, AuthController.login);
AuthRouter.post('/refresh', authenticate, AuthController.refresh);
AuthRouter.post('/logout', authenticate, AuthController.logout);

export default AuthRouter;