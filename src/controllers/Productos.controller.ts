import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/responses';
import ProductosService from '../services/Productos.service';

const productosService = new ProductosService();

class ProductosController {

  static async create(req: Request, res: Response) {
    const data = req.body;
    try {
      const resultado = await productosService.create(data);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 201, resultado.data, 'Producto registrado con éxito');
    } catch (error: any) {
      return sendError(res);
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const queryParams = {
        nombre: req.query.nombre as string,
      };
      const resultado = await productosService.getAll(queryParams);
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
      const resultado = await productosService.getById(id);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 200, resultado.data);
    } catch (error: any) {
      return sendError(res);
    }
  }

  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const data = req.body;
    try {
      const resultado = await productosService.update(id, data);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 200, resultado.data, 'Producto actualizado con éxito');
    } catch (error: any) {
      return sendError(res);
    }
  }

  static async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      const resultado = await productosService.delete(id);
      if (!resultado.success) {
        return sendError(res, resultado.type, resultado.message);
      }
      return sendSuccess(res, 200, null, 'Producto eliminado con éxito');
    } catch (error: any) {
      return sendError(res);
    }
  }

}

export default ProductosController;