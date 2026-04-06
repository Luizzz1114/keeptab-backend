import { z } from 'zod';

export const createUsuarioSchema = z.object({
  username: z.string({ message: "El nombre de usuario es obligatorio y debe ser un texto" })
    .trim()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(50, "El nombre de usuario no puede exceder los 50 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "El nombre de usuario solo puede contener letras, números y guiones bajos"),
  
  nombre: z.string({ message: "El nombre es obligatorio y debe ser un texto" })
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
  
  password: z.string({ message: "La contraseña es obligatoria y debe ser un texto" })
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(100, "La contraseña es demasiado larga")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
    .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número")
    .regex(/[\W_]/, "La contraseña debe contener al menos un carácter especial (ej. ! @ # $ % & *)")
});

export const updateUsuarioSchema = createUsuarioSchema.partial();

export type CreateUsuarioDTO = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioDTO = z.infer<typeof updateUsuarioSchema>;