import { Request, Response } from 'express';
import JornadasService from '../services/Jornadas.service';
import { z } from 'zod';
import { abrirJornadaSchema, cerrarJornadaSchema } from '../schemas/Jornadas.dto';

const jornadasService = new JornadasService();

class JornadasController {

  static async abrir(req: Request, res: Response) {
    const valid = abrirJornadaSchema.safeParse(req.body);
    if (!valid.success) {
      return res.status(400).json({
        message: 'Datos inválidos',
        errors: z.flattenError(valid.error).fieldErrors
      });
    }
    try {
      const resultado = await jornadasService.abrir(valid.data);
      if (!resultado.success) {
        return res.status(409).json({ message: resultado.message });
      }
      return res.status(201).json({ message: 'Jornada abierta con éxito', jornada: resultado.data });
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const jornadas = await jornadasService.getAll();
      return res.status(200).json(jornadas);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async getById(req: Request, res: Response) {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ message: 'ID de jornada inválido' });
    try {
      const jornada = await jornadasService.getById(id);
      if (!jornada) return res.status(404).json({ message: 'Jornada no encontrada' });
      return res.status(200).json(jornada);
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async getActual(req: Request, res: Response) {
    try {
      const resultado = await jornadasService.getEstadoActual();
      if (!resultado.success) return res.status(404).json({ message: resultado.message });
      return res.status(200).json({ jornada: resultado.data });
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async cerrar(req: Request, res: Response) {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ message: 'ID de jornada inválido' });
    const valid = cerrarJornadaSchema.safeParse(req.body);
    if (!valid.success) {
      return res.status(400).json({
        message: 'Datos inválidos',
        errors: z.flattenError(valid.error).fieldErrors
      });
    }
    try {
      const resultado = await jornadasService.cerrar(id, valid.data);
      if (!resultado.success) {
        const statusCode = resultado.type === 'NOT_FOUND' ? 404 : 400;
        return res.status(statusCode).json({ message: resultado.message });
      }
      return res.status(200).json({ message: 'Jornada cerrada y cuadrada con éxito', jornada: resultado.data });
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async delete(req: Request, res: Response) {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ message: 'ID de jornada inválido' });
    try {
      const resultado = await jornadasService.delete(id);
      if (!resultado?.success) {
        const statusCode = resultado?.type === 'NOT_FOUND' ? 404 : 400;
        return res.status(statusCode).json({ message: resultado?.message });
      }
      return res.status(200).json({ message: `Jornada eliminada con éxito` });
    } catch (error: any) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
}

export default JornadasController;