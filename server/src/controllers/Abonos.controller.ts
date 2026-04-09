import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/responses';
import AbonosService from '../services/Abonos.service';

const abonosService = new AbonosService();

class AbonosController {

  static async create(req: Request, res: Response) {
    const data = req.body;
    try {
      const resultado = await abonosService.create(data);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 201, resultado.data, 'Abono registrado con éxito');
    } catch (error: any) {
      return sendError(res);
    }
  }

  static async getAll(_req: Request, res: Response) {
    try {
      const resultado = await abonosService.getAll();
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
      const resultado = await abonosService.getById(id);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 200, resultado.data);
    } catch (error: any) {
      return sendError(res);
    }
  }

  static async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      const resultado = await abonosService.delete(id);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 200, null, 'Abono eliminado con éxito y deuda restaurada');
    } catch (error: any) {
      return sendError(res);
    }
  }

}

export default AbonosController;