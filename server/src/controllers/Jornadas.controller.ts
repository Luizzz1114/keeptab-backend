import { Request, Response } from 'express';
import JornadasService from '../services/Jornadas.service';
import { sendSuccess, sendError } from '../utils/responses';

const jornadasService = new JornadasService();

class JornadasController {

  static async abrir(req: Request, res: Response) {
    const data = req.body;
    try {
      const resultado = await jornadasService.abrir(data);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 201, resultado.data, 'Jornada abierta con éxito' );
    } catch (error: any) {
      return sendError(res);
    }
  }

  static async getAll(_req: Request, res: Response) {
    try {
      const resultado = await jornadasService.getAll();
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
      const resultado = await jornadasService.getById(id);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 200, resultado.data);
    } catch (error: any) {
      return sendError(res);
    }
  }

  static async getEstadoActual(_req: Request, res: Response) {
    try {
      const resultado = await jornadasService.getEstadoActual();
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 200, resultado.data);
    } catch (error: any) {
      return sendError(res);
    }
  }

  static async cerrar(req: Request, res: Response) {
    const id = Number(req.params.id);
    const data = req.body;
    try {
      const resultado = await jornadasService.cerrar(id, data);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 200, resultado.data, 'Jornada cerrada con éxito');
    } catch (error: any) {
      return sendError(res);
    }
  }

  static async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      const resultado = await jornadasService.delete(id);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 200, null, 'Jornada eliminada correctamente');
    } catch (error: any) {
      return sendError(res);
    }
  }
}

export default JornadasController;