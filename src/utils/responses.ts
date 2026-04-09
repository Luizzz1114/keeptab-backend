import { Response } from 'express';

const HTTP_STATUS = {
  NOT_FOUND: 404,
  CONFLICT: 409,
  DB_ERROR: 500,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  BAD_REQUEST: 400,
  INSUFFICIENT_STOCK: 400
} as const;

type HttpStatusKey = keyof typeof HTTP_STATUS;

export const sendSuccess = (res: Response, status: number, data: unknown = null, message?: string) => {
  return res.status(status).json({
    success: true,
    message: message || 'Operación exitosa',
    data
  });
}

export const sendError = (res: Response, type?: string | null, message?: string, errors?: unknown) => {
  const isValidType = type && type in HTTP_STATUS;
  const status = isValidType ? HTTP_STATUS[type as HttpStatusKey] : 500;
  const finalMessage = message || (status === 500 ? 'Error interno del servidor' : 'Ha ocurrido un error');
  return res.status(status).json({
    success: false,
    message: finalMessage,
    errors 
  });
}