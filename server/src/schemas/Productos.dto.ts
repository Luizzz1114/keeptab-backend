import { z } from 'zod';

export const createProductoSchema = z.object({
  nombre: z.string({ message: "El nombre es obligatorio y debe ser un texto" })
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  precio: z.number({ message: "El precio es obligatorio y debe ser un número" })
    .positive("El precio debe ser mayor a cero"),
  conteo: z.boolean({ message: "El conteo debe ser verdadero o falso" })
    .optional()
    .default(false),
  stock: z.number({ message: "El stock debe ser un número" })
    .int("El stock debe ser un número entero")
    .nonnegative("El stock no puede ser negativo")
    .optional()
    .default(0)
});

export const updateProductoSchema = createProductoSchema.partial();

export type CreateProductoDTO = z.infer<typeof createProductoSchema>;
export type UpdateProductoDTO = z.infer<typeof updateProductoSchema>;