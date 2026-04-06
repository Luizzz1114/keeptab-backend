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
      const cliente = await clientesService.create(valid.data);
      return res.status(201).json({ message: 'Cliente registrado con éxito', cliente });
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const clientes = await clientesService.getAll();
      return res.status(200).json(clientes);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async getById(req: Request, res: Response) {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ message: 'ID de cliente inválido' });
    try {
      const cliente = await clientesService.getById(id);
      if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
      return res.status(200).json(cliente);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async getDeudas(req: Request, res: Response) {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ message: 'ID de cliente inválido' });
    try {
      const deudas = await clientesService.getDeudas(id);
      if (!deudas) return res.status(404).json({ message: 'Cliente no encontrado' });
      return res.status(200).json(deudas);
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
      const cliente = await clientesService.update(id, valid.data);
      if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
      return res.status(200).json({ message: 'Cliente actualizado con éxito', cliente });
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async delete(req: Request, res: Response) {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ message: 'ID de cliente inválido' });
    try {
      const cliente = await clientesService.delete(id);
      if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
      return res.status(200).json({ message: `Cliente eliminado con éxito` });
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

}

export default ClientesController;