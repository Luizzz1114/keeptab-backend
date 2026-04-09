import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/responses';
import AuthService from '../services/Auth.service';

const authService = new AuthService();

class AuthController {

  static async setAdmin(req: Request, res: Response) {
    const data = req.body;
    try {
      const resultado = await authService.setAdmin(data);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 201, resultado.data, 'Administrador creado con éxito');
    } catch (error: any) {
      return sendError(res);
    }
  }

  static async login(req: Request, res: Response) {
    const data = req.body;
    try {
      const resultado = await authService.login(data);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 200, resultado.data);
    } catch (error: any) {
      return sendError(res);
    }
  }

  static async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;
    try {
      const resultado = await authService.refresh(refreshToken);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 200, resultado.data);
    } catch (error: any) {
      return sendError(res);
    }
  }

  static async logout(req: Request, res: Response) {
    const id = Number(req.user?.id);
    try {
      const resultado = await authService.logout(id);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 200, null, 'Sesión cerrada exitosamente');
    } catch (error: any) {
      return sendError(res);
    }
  }

}

export default AuthController;