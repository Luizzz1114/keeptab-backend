import { Router } from 'express';
import { loginLimiter } from '../middlewares/limiter.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validator.middleware';
import { createAdminSchema, loginSchema, refreshTokenSchema } from '../schemas/Auth.dto';
import AuthController from '../controllers/Auth.controller';

const AuthRouter: Router = Router();

AuthRouter.post('/set-admin', loginLimiter, validateBody(createAdminSchema), AuthController.setAdmin);
AuthRouter.post('/login', loginLimiter, validateBody(loginSchema), AuthController.login);

AuthRouter.use(authenticate);

AuthRouter.post('/refresh', validateBody(refreshTokenSchema), AuthController.refresh);
AuthRouter.post('/logout', AuthController.logout);

export default AuthRouter;