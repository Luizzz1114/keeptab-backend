import { Request, Response } from 'express';
import AbonosService from '../services/Abonos.service';
import { z } from 'zod';
import { createAbonoSchema } from '../schemas/Abonos.dto';

const abonosService = new AbonosService();

class AbonosController {

  static async create(req: Request, res: Response) {
    const valid = createAbonoSchema.safeParse(req.body);
    if (!valid.success) {
      return res.status(400).json({
        message: 'Datos inválidos',
        errors: z.flattenError(valid.error).fieldErrors
      });
    }
    try {
      const resultado = await abonosService.create(valid.data);
      if (!resultado.success) {
        const statusCode = resultado.type === 'DB_ERROR' ? 500 : resultado.type === 'NOT_FOUND' ? 404 : 400;
        const message = statusCode === 500 ? 'Error interno del servidor' : resultado.message
        return res.status(statusCode).json({ message });
      }
      return res.status(201).json({ message: 'Abono registrado con éxito', abono: resultado.data });
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const abonos = await abonosService.getAll();
      return res.status(200).json(abonos);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async getById(req: Request, res: Response) {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ message: 'ID de abono inválido' });
    try {
      const abono = await abonosService.getById(id);
      if (!abono) return res.status(404).json({ message: 'Abono no encontrado' });
      return res.status(200).json(abono);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async delete(req: Request, res: Response) {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ message: 'ID de abono inválido' });
    try {
      const resultado = await abonosService.delete(id);
      if (!resultado.success) {
        const statusCode = resultado.type === 'DB_ERROR' ? 500 : resultado.type === 'NOT_FOUND' ? 404 : 400;
        const message = statusCode === 500 ? 'Error interno del servidor' : resultado.message;
        return res.status(statusCode).json({ message });
      }
      return res.status(200).json({ message: `Abono eliminado con éxito y deuda restaurada` });
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

}

export default AbonosController;