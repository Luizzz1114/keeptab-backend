import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/responses';
import ClientesService from '../services/Clientes.service';


const clientesService = new ClientesService();

class ClientesController {

  static async create(req: Request, res: Response) {
    const data = req.body;
    try {
      const resultado = await clientesService.create(data);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 201, { message: 'Cliente registrado con éxito', cliente: resultado.data });
    } catch (error: any) {
      return sendError(res);
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const queryParams = {
        cedula: req.query.cedula as string,
      };
      const resultado = await clientesService.getAll(queryParams);
      if (!resultado.success) {
        return sendError(res);
      }
      return sendSuccess(res, 200, { clientes: resultado.data });
    } catch (error: any) {
      return sendError(res);
    }
  }

  static async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      const resultado = await clientesService.getById(id);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 200, { cliente: resultado.data });
    } catch (error: any) {
      return sendError(res);
    }
  }

  static async getDeudas(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      const resultado = await clientesService.getDeudas(id);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 200, { cliente: resultado.data });
    } catch (error: any) {
      return sendError(res);
    }
  }

  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const data = req.body;
    try {
      const resultado = await clientesService.update(id, data);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 200, { message: 'Cliente actualizado con éxito', cliente: resultado.data });
    } catch (error: any) {
      return sendError(res);
    }
  }

  static async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      const resultado = await clientesService.delete(id);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 200, { message: 'Cliente eliminado con éxito' });
    } catch (error: any) {
      return sendError(res);
    }
  }

}

export default ClientesController;