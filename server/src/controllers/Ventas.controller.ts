import { Request, Response } from 'express';
import VentasService from '../services/Ventas.service';
import { z } from 'zod';
import { createVentaSchema } from '../schemas/Ventas.dto';

const ventasService = new VentasService();

class VentasController {

  static async create(req: Request, res: Response) {
    const valid = createVentaSchema.safeParse(req.body);
    if (!valid.success) {
      return res.status(400).json({
        message: 'Datos inválidos',
        errors: z.flattenError(valid.error).fieldErrors,
      });
    }
    try {
      const resultado = await ventasService.create(valid.data);
      if (!resultado.success) {
        const statusCode = resultado.type === 'DB_ERROR' ? 500 : resultado.type === 'NOT_FOUND' ? 404 : resultado.type === 'INSUFFICIENT_STOCK' ? 409 : 400;
        const message = statusCode === 500 ? 'Error interno del servidor' : resultado.message
        return res.status(statusCode).json({ message });
      }
      return res.status(201).json({ message: 'Venta registrada con éxito', venta: resultado.data });
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
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
        return res.status(400).json({ message: 'Error al obtener las ventas' });
      }
      return res.status(200).json(resultado.data);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async getById(req: Request, res: Response) {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ message: 'ID de venta inválido' });
    try {
      const resultado = await ventasService.getById(id);
      if (!resultado.success) {
        const statusCode = resultado.type === 'NOT_FOUND' ? 404 : 400;
        return res.status(statusCode).json({ message: resultado.message });
      }
      return res.status(200).json(resultado.data);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async delete(req: Request, res: Response) {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ message: 'ID de venta inválido' });
    try {
      const resultado = await ventasService.delete(id);
      if (!resultado.success) {
        const statusCode = resultado.type === 'DB_ERROR' ? 500 : resultado.type === 'NOT_FOUND' ? 404 : 400;
        const message = statusCode === 500 ? 'Error interno del servidor' : resultado.message;
        return res.status(statusCode).json({ message });
      }
      return res.status(200).json({ message: `Venta anulada con éxito y stock devuelto` });
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

}

export default VentasController;