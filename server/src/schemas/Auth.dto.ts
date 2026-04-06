import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string({ message: "El usuario es obligatorio" }).trim(),
  password: z.string({ message: "La contraseña es obligatoria" })
});

export type LoginDTO = z.infer<typeof loginSchema>;