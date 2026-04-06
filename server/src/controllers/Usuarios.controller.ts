import { Request, Response } from 'express';
import UsuariosService from '../services/Usuarios.service';
import { z } from 'zod';
import { createUsuarioSchema, updateUsuarioSchema } from '../schemas/Usuarios.dto';

const usuariosService = new UsuariosService();

class UsuariosController {
  
  static async create(req: Request, res: Response) {
    const valid = createUsuarioSchema.safeParse(req.body);
    if (!valid.success) {
      return res.status(400).json({
        message: 'Datos inválidos',
        errors: z.flattenError(valid.error).fieldErrors
      });
    }
    try {
      const resultado = await usuariosService.create(valid.data);
      if (!resultado.success) {
        const statusCode = resultado.type === 'DB_ERROR' ? 500 : resultado.type === 'CONFLICT' ? 409 : 400;
        const message = statusCode === 500 ? 'Error interno del servidor' : resultado.message;
        return res.status(statusCode).json({ message });
      }
      return res.status(201).json({ message: 'Usuario registrado con éxito', usuario: resultado.data });
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const queryParams = {
        username: req.query.username as string,
      };
      const resultado = await usuariosService.getAll(queryParams);
      if (!resultado.success) {
        return res.status(400).json({ message: 'Error al obtener los usuarios' });
      }
      return res.status(200).json(resultado.data);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async getById(req: Request, res: Response) {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ message: 'ID de usuario inválido' });
    try {
      const resultado = await usuariosService.getById(id);
      if (!resultado.success) {
        return res.status(404).json({ message: resultado.message });
      }
      return res.status(200).json(resultado.data);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async update(req: Request, res: Response) {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ message: 'ID de usuario inválido' });
    const valid = updateUsuarioSchema.safeParse(req.body);
    if (!valid.success) {
      return res.status(400).json({
        message: 'Datos inválidos',
        errors: z.flattenError(valid.error).fieldErrors
      });
    }
    try {
      const resultado = await usuariosService.update(id, valid.data);
      if (!resultado.success) {
        const statusCode = resultado.type === 'DB_ERROR' ? 500 : resultado.type === 'CONFLICT' ? 409 : resultado.type === 'NOT_FOUND' ? 404 : 400;
        const message = statusCode === 500 ? 'Error interno del servidor' : resultado.message;
        return res.status(statusCode).json({ message });
      }
      return res.status(200).json({ message: 'Usuario actualizado con éxito', usuario: resultado.data });
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async delete(req: Request, res: Response) {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ message: 'ID de usuario inválido' });
    try {
      const resultado = await usuariosService.delete(id);
      if (!resultado.success) {
        const statusCode = resultado.type === 'DB_ERROR' ? 500 : resultado.type === 'CONFLICT' ? 409 : resultado.type === 'NOT_FOUND' ? 404 : 400;
        const message = statusCode === 500 ? 'Error interno del servidor' : resultado.message;
        return res.status(statusCode).json({ message });
      }
      return res.status(200).json({ message: 'Usuario eliminado con éxito' });
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
  
}

export default UsuariosController;