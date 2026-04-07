import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UsuariosRepository from '../repositories/Usuarios.repository';

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; username: string; rol: string };
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    return res.status(401).json({ message: 'No se proporcionó token de acceso' });
  }
  const token = bearer.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as { id: number, username: string };
    if(typeof decoded === 'object' && decoded.username) {
      const usuarioRepository = new UsuariosRepository();
      const usuario = await usuarioRepository.getById(decoded.id);
      if (usuario) {
        req.user = usuario;
        next();
      } else {
        return res.status(401).json({ message: 'Token de acceso inválido' });
      }
    } else {
      return res.status(401).json({ message: 'Token de acceso inválido' });
    }
  } catch (error) {
    return res.status(403).json({ message: 'Token de acceso inválido o expirado' });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.rol === 'ADMIN') {
    return next();
  }
  return res.status(403).json({ message: 'Acceso denegado: Se requieren permisos de administrador' });
}