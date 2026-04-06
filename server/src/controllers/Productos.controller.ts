import { Request, Response } from 'express';
import ProductosService from '../services/Productos.service';
import { z } from 'zod';
import { createProductoSchema, updateProductoSchema } from '../schemas/Productos.dto';

const productosService = new ProductosService();

class ProductosController {

  static async create(req: Request, res: Response) {
    const valid = createProductoSchema.safeParse(req.body);
    if (!valid.success) {
      return res.status(400).json({
        message: 'Datos inválidos',
        errors: z.flattenError(valid.error).fieldErrors 
      });
    }
    try {
      const resultado = await productosService.create(valid.data);
      if (!resultado.success) {
        const statusCode = resultado.type === 'DB_ERROR' ? 500 : resultado.type === 'CONFLICT' ? 409 : 400;
        const message = statusCode === 500 ? 'Error interno del servidor' : resultado.message;
        return res.status(statusCode).json({ message });
      }
      return res.status(201).json({ message: 'Producto registrado con éxito', producto: resultado.data });
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const queryParams = {
        nombre: req.query.nombre as string,
      };
      const resultado = await productosService.getAll(queryParams);
      if (!resultado.success) {
        return res.status(400).json({ message: 'Error al obtener los productos' });
      }
      return res.status(200).json(resultado.data);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async getById(req: Request, res: Response) {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ message: 'ID de producto inválido' });
    try {
      const resultado = await productosService.getById(id);
      if (!resultado.success) {
        const statusCode = resultado.type === 'NOT_FOUND' ? 404 : 400;
        return res.status(statusCode).json({ message: resultado.message });
      }
      return res.status(200).json(resultado.data);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async update(req: Request, res: Response) {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ message: 'ID de producto inválido' });
    const valid = updateProductoSchema.safeParse(req.body);
    if (!valid.success) {
      return res.status(400).json({
        message: 'Datos inválidos',
        errors: z.flattenError(valid.error).fieldErrors
      });
    }
    try {
      const resultado = await productosService.update(id, valid.data);
      if (!resultado.success) {
        const statusCode = resultado.type === 'DB_ERROR' ? 500 : resultado.type === 'CONFLICT' ? 409 : resultado.type === 'NOT_FOUND' ? 404 : 400;
        const message = statusCode === 500 ? 'Error interno del servidor' : resultado.message;
        return res.status(statusCode).json({ message });
      }
      return res.status(200).json({ message: 'Producto actualizado con éxito', producto: resultado.data });
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async delete(req: Request, res: Response) {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ message: 'ID de producto inválido' });
    try {
      const resultado = await productosService.delete(id);
      if (!resultado.success) {
        const statusCode = resultado.type === 'DB_ERROR' ? 500 : resultado.type === 'NOT_FOUND' ? 404 : 400;
        const message = statusCode === 500 ? 'Error interno del servidor' : resultado.message;
        return res.status(statusCode).json({ message });
      }
      return res.status(200).json({ message: `Producto eliminado con éxito` });
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

}

export default ProductosController;