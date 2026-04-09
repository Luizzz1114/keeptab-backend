import { z } from 'zod';
import { createUsuarioSchema } from './Usuarios.dto';

export const loginSchema = z.object({
  username: z.string({ message: "El usuario es obligatorio" }).trim(),
  password: z.string({ message: "La contraseña es obligatoria" })
});

export const createAdminSchema = createUsuarioSchema.extend({
  rol: z.literal('ADMIN').default('ADMIN')
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string({
    message: "No se proporcionó refresh token",
  }).min(1, "No se proporcionó refresh token"),
});

export type LoginDTO = z.infer<typeof loginSchema>;
export type CreateAdminDTO = z.infer<typeof createAdminSchema>;
export type RefreshTokenDTO = z.infer<typeof refreshTokenSchema>;