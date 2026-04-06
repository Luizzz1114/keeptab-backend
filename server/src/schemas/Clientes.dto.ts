import { z } from 'zod';

export const createClienteSchema = z.object({
  cedula: z.string({ message: "La cédula del cliente es obligatoria y debe ser un texto"})
    .trim()
    .min(1, 'La cédula es obligatoria')
    .regex(/^\d{7,8}$/, 'La cédula debe tener entre 7 y 8 números'),
  nombre: z.string({ message: "El nombre del cliente es obligatorio y debe ser texto" })
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  contacto: z.string({ message: "El contacto debe ser un texto" })
    .optional()
    .nullable()
});

export const updateClienteSchema = createClienteSchema.partial();

export type CreateClienteDTO = z.infer<typeof createClienteSchema>;
export type UpdateClienteDTO = z.infer<typeof updateClienteSchema>;