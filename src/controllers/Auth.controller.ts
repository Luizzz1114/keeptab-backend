import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/responses';
import AuthService from '../services/Auth.service';

const authService = new AuthService();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
};

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
      const { accessToken, refreshToken, usuario } = resultado.data as { accessToken: string, refreshToken: string, usuario: { id: number, username: string, rol: string } };
      res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
      res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
      return sendSuccess(res, 200, usuario);
    } catch (error: any) {
      return sendError(res);
    }
  }

  static async refresh(req: Request, res: Response) {
    const refreshTokenOld = req.cookies.refreshToken;
    const usuario = req.user;
    try {
      const resultado = await authService.refresh(usuario, refreshTokenOld);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      const { accessToken, refreshToken } = resultado.data as { accessToken: string, refreshToken: string };
      res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
      res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
      return sendSuccess(res, 200, null, 'Token renovado');
    } catch (error: any) {
      return sendError(res);
    }
  }

  static async logout(req: Request, res: Response) {
    const usuario = req.user;
    try {
      const resultado = await authService.logout(usuario);
      res.clearCookie('accessToken', cookieOptions);
      res.clearCookie('refreshToken', cookieOptions);
      if (!resultado.success) {
        return sendError(res, resultado.type);
      }
      return sendSuccess(res, 200, null, 'Sesión cerrada exitosamente');
    } catch (error: any) {
      return sendError(res);
    }
  }

}

export default AuthController;