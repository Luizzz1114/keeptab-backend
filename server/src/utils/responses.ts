import { Response } from 'express';

const HTTP_STATUS = {
  NOT_FOUND: 404,
  CONFLICT: 409,
  DB_ERROR: 500,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  BAD_REQUEST: 400
} as const;

type HttpStatusKey = keyof typeof HTTP_STATUS;

export const sendSuccess = (res: Response, status: number, data: any = null, message?: string) => {
  return res.status(status).json({
    success: true,
    message: message || 'Operación exitosa',
    data: data
  });
}

export const sendError = (res: Response, type?: string | null, message: string = 'Ha ocurrido un error') => {
  const status = HTTP_STATUS[type as HttpStatusKey] || 500;
  const finalMessage = status === 500 ? 'Error interno del servidor' : message;
  return res.status(status).json({ 
    success: false, 
    message: finalMessage 
  });
}