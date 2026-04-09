import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo en 15 minutos.' 
  }
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    message: 'Demasiados intentos de inicio de sesión. Por favor, intenta de nuevo en 15 minutos.' 
  }
});