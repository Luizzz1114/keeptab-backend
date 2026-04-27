import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/responses';
import jwt from 'jsonwebtoken';
import UsuariosRepository from '../repositories/Usuarios.repository';

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; username: string; rol?: string };
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return sendError(res, 'UNAUTHORIZED', 'No se proporcionó token de acceso');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as { id: number, username: string };
    if(typeof decoded === 'object' && decoded.username) {
      const usuarioRepository = new UsuariosRepository();
      const usuario = await usuarioRepository.getById(decoded.id);
      if (usuario) {
        req.user = usuario;
        next();
      } else {
        return sendError(res, 'UNAUTHORIZED', 'Token de acceso inválido');
      }
    } else {
      return sendError(res, 'UNAUTHORIZED', 'Token de acceso inválido');
    }
  } catch (error) {
    return sendError(res, 'UNAUTHORIZED', 'Token de acceso inválido o expirado');
  }
};

export const authenticateRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken; 
  if (!refreshToken) {
    return sendError(res, 'UNAUTHORIZED', 'No se proporcionó refresh token');
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { id: number, username: string };
    console.log(decoded);
    if (typeof decoded === 'object' && decoded.username) {
      const usuarioRepository = new UsuariosRepository();
      const usuario = await usuarioRepository.getById(decoded.id);
      if (usuario) {
        req.user = usuario;
        return next();
      } else {
        return sendError(res, 'UNAUTHORIZED', 'El usuario asociado a este token ya no existe o fue deshabilitado');
      }
    } else {
      return sendError(res, 'UNAUTHORIZED', 'Refresh token con formato inválido');
    }
  } catch (error) {
    return sendError(res, 'FORBIDDEN', 'La sesión expiró por completo. Por favor, inicia sesión nuevamente.');
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.rol === 'ADMIN') {
    return next();
  }
  return sendError(res, 'FORBIDDEN', 'Acceso denegado: Se requieren permisos de administrador');
}