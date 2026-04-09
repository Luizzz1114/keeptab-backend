import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/responses';
import { z } from 'zod';

export const validateBody = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const resultado = schema.safeParse(req.body);
    if(!resultado.success) {
      const flattened = z.flattenError(resultado.error);
      return sendError(res, 'BAD_REQUEST', 'Datos inválidos', flattened.fieldErrors);
    }
    req.body = resultado.data;
    next();
  }
}

export const validateId = (entity: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (isNaN(id) || !Number.isInteger(id) || id < 0) {
      return sendError(res, 'BAD_REQUEST', `ID de ${entity} inválido`);
    }
    next();
  }
}