import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/responses';
import UsuariosService from '../services/Usuarios.service';

const usuariosService = new UsuariosService();

class UsuariosController {
  
  static async create(req: Request, res: Response) {
    const data = req.body;
    try {
      const resultado = await usuariosService.create(data);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 201, resultado.data, 'Usuario registrado con éxito');
    } catch (error: any) {
      return sendError(res);
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const queryParams = {
        username: req.query.username as string,
      };
      const resultado = await usuariosService.getAll(queryParams);
      if (!resultado.success) {
        return sendError(res);
      }
      return sendSuccess(res, 200, resultado.data);
    } catch (error: any) {
      return sendError(res);
    }
  }

  static async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      const resultado = await usuariosService.getById(id);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 200, resultado.data);
    } catch (error: any) {
      return sendError(res);
    }
  }

  static async getMe(req: Request, res: Response) {
    const id = Number(req.user?.id);
    try {
      const resultado = await usuariosService.getById(id);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 200, resultado.data);
    } catch (error) {
      return sendError(res);
    }
  }

  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const data = req.body;
    try {
      const resultado = await usuariosService.update(id, data);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 200, resultado.data, 'Usuario actualizado con éxito');
    } catch (error: any) {
      return sendError(res);
    }
  }

  static async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      const resultado = await usuariosService.delete(id);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 200, null, 'Usuario eliminado con éxito');
    } catch (error: any) {
      return sendError(res);
    }
  }
  
}

export default UsuariosController;