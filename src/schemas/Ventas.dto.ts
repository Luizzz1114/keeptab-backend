import { z } from 'zod';

const detalleVentaSchema = z.object({
  producto_id: z.number({ message: "El ID del producto es obligatorio y debe ser un número" })
    .int("El ID del producto debe ser entero")
    .positive("El ID del producto debe ser mayor a 0"),
  cantidad: z.number({ message: "La cantidad es obligatoria y debe ser un número" })
    .int("La cantidad debe ser entera")
    .positive("La cantidad debe ser al menos 1")
});

export const createVentaSchema = z.object({
  cliente_id: z.number({ message: "El ID del cliente debe ser un número" })
    .int("El ID del cliente debe ser entero")
    .positive("El ID del cliente debe ser mayor a 0")
    .optional()
    .nullable(),
  estatus: z.enum(["PAGADA", "FIADA"], {
    message: "El estatus es obligatorio y solo puede ser 'PAGADA' o 'FIADA'"
  }),
  detalles: z.array(detalleVentaSchema, {
    message: "Los detalles son obligatorios y deben enviarse en una lista"
  }).min(1, "La venta debe incluir al menos un producto"),
})
.refine((data) => {
  if (data.estatus === "FIADA" && !data.cliente_id) {
    return false;
  }
  return true; 
}, {
  message: "Para registrar una venta FIADA, es obligatorio incluir el ID del cliente",
  path: ["cliente_id"]
});

export type CreateVentaDTO = z.infer<typeof createVentaSchema>;