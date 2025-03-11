import { z } from "zod";

// Get today's date in 'YYYY-MM-DD' format
const today = new Date().toISOString().split("T")[0];

export const facturaSchema = z.object({
    numero_factura: z.string()
        .min(1, { message: "El número de factura es obligatorio." }),
    valor: z.number({ invalid_type_error: "El valor debe ser un número, no un texto." })
        .positive({ message: "El valor de la factura debe ser un número positivo." }),
    estado: z.enum(["cancelado", "sin cancelar"])
});

export const rentasYRegistroSchema = z.object({
    escritura_id: z.number({ invalid_type_error: "El ID de la escritura debe ser un número, no un texto." })
        .positive({ message: "El ID de la escritura debe ser un número positivo." }),

    valor_rentas: z.number({ invalid_type_error: "El valor de rentas debe ser un número, no un texto." })
        .positive({ message: "El valor de rentas debe ser un número positivo." }),

    metodo_pago_rentas: z.enum(["pse", "efectivo"]),

    valor_registro: z.number({ invalid_type_error: "El valor de registro debe ser un número, no un texto." })
        .positive({ message: "El valor de registro debe ser un número positivo." }),

    metodo_pago_registro: z.enum(["pse", "efectivo"]),

    fecha: z.string()
        .refine((date) => date <= today, {
            message: "La fecha debe ser menor o igual a la fecha de hoy.",
        }),

    devoluciones: z.number({ invalid_type_error: "Las devoluciones deben ser un número, no un texto." })
        .nonnegative({ message: "Las devoluciones no pueden ser negativas." }),

    excedentes: z.number({ invalid_type_error: "Los excedentes deben ser un número, no un texto." })
        .nonnegative({ message: "Los excedentes no pueden ser negativos." }),

    observaciones: z.string().optional(),

    facturas: z.array(facturaSchema)
        .nonempty({ message: "Debe haber al menos una factura." }),
});