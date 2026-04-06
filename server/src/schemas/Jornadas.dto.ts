import { z } from 'zod';

export const abrirJornadaSchema = z.object({
  fondo_inicial: z.number({ message: "El fondo inicial es obligatorio y debe ser un número" })
    .nonnegative("El fondo inicial no puede ser negativo")
});

export const cerrarJornadaSchema = z.object({
  total_fisico: z.number({ message: "El total físico es obligatorio y debe ser un número" })
    .nonnegative("El total físico no puede ser negativo")
});

export type AbrirJornadaDTO = z.infer<typeof abrirJornadaSchema>;
export type CerrarJornadaDTO = z.infer<typeof cerrarJornadaSchema>;