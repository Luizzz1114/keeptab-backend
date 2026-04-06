import { z } from 'zod';

export const createAbonoSchema = z.object({
  venta_id: z.number({ message: "El ID de la venta es obligatorio y debe ser un número" })
    .int("El ID de la venta debe ser un número entero")
    .positive("El ID de la venta debe ser mayor a 0"),
  monto: z.number({ message: "El monto es obligatorio y debe ser un número" })
    .positive("El monto a abonar debe ser mayor a 0")
});

export type CreateAbonoDTO = z.infer<typeof createAbonoSchema>;