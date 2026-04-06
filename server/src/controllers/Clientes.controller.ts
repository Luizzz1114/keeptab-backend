import { Request, Response } from 'express';
import ClientesService from '../services/Clientes.service';
import { z } from 'zod';
import { createClienteSchema, updateClienteSchema } from '../schemas/Clientes.dto';

const clientesService = new ClientesService();

class ClientesController {

  static async create(req: Request, res: Response) {
    const valid = createClienteSchema.safeParse(req.body);
    if (!valid.success) {
      return res.status(400).json({
        message: 'Datos inválidos',
        errors: z.flattenError(valid.error).fieldErrors
      });
    }
    try {
      const resultado = await clientesService.create(valid.data);
      if (!resultado.success) {
        const statusCode = resultado.type === 'DB_ERROR' ? 500 : resultado.type === 'CONFLICT' ? 409 : 400;
        const message = statusCode === 500 ? 'Error interno del servidor' : resultado.message;
        return res.status(statusCode).json({ message });
      }
      return res.status(201).json({ message: 'Cliente registrado con éxito', cliente: resultado.data });
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const queryParams = {
        cedula: req.query.cedula as string,
      };
      const resultado = await clientesService.getAll(queryParams);
      if (!resultado.success) {
        return res.status(400).json({ message: 'Error al obtener los clientes' });
      }
      return res.status(200).json(resultado.data);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async getById(req: Request, res: Response) {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ message: 'ID de cliente inválido' });
    try {
      const resultado = await clientesService.getById(id);
      if (!resultado.success) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }
      return res.status(200).json(resultado.data);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async getDeudas(req: Request, res: Response) {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ message: 'ID de cliente inválido' });
    try {
      const resultado = await clientesService.getDeudas(id);
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
    if (isNaN(id)) return res.status(400).json({ message: 'ID de cliente inválido' });
    const valid = updateClienteSchema.safeParse(req.body);
    if (!valid.success) {
      return res.status(400).json({
        message: 'Datos inválidos',
        errors: z.flattenError(valid.error).fieldErrors
      });
    }
    try {
      const resultado = await clientesService.update(id, valid.data);
      if (!resultado.success) {
        const statusCode = resultado.type === 'DB_ERROR' ? 500 : resultado.type === 'CONFLICT' ? 409 : resultado.type === 'NOT_FOUND' ? 404 : 400;
        const message = statusCode === 500 ? 'Error interno del servidor' : resultado.message;
        return res.status(statusCode).json({ message });
      }
      return res.status(200).json({ message: 'Cliente actualizado con éxito', cliente: resultado.data });
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async delete(req: Request, res: Response) {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ message: 'ID de cliente inválido' });
    try {
      const resultado = await clientesService.delete(id);
      if (!resultado.success) {
        const statusCode = resultado.type === 'DB_ERROR' ? 500 : resultado.type === 'CONFLICT' ? 409 : resultado.type === 'NOT_FOUND' ? 404 : 400;
        const message = statusCode === 500 ? 'Error interno del servidor' : resultado.message;
        return res.status(statusCode).json({ message });
      }
      return res.status(200).json({ message: `Cliente eliminado con éxito` });
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

}

export default ClientesController;