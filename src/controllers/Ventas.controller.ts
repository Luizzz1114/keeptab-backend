import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/responses';
import VentasService from '../services/Ventas.service';

const ventasService = new VentasService();

class VentasController {

  static async create(req: Request, res: Response) {
    const data = req.body;
    try {
      const resultado = await ventasService.create(data);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 201, resultado.data, 'Venta registrada con éxito');
    } catch (error: any) {
      return sendError(res);
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const queryParams = {
        estatus: req.query.estatus as string,
        fecha: req.query.fecha as string,
      };
      const resultado = await ventasService.getAll(queryParams);
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
      const resultado = await ventasService.getById(id);
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
      const resultado = await ventasService.delete(id);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 200, null, 'Venta anulada con éxito y stock devuelto');
    } catch (error: any) {
      return sendError(res);
    }
  }

}

export default VentasController;