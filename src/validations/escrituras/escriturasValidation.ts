import { z } from "zod";

// Obtener la fecha de hoy en formato 'YYYY-MM-DD'
const today = new Date().toISOString().split("T")[0];

export const escrituraSchema = z.object({
    numero_escritura: z.string()
        .max(5, "El número de escritura no puede tener más de 5 caracteres.")
        .regex(/^\d+$/, "El número de escritura debe contener solo dígitos."), // Solo números

    user_id: z.number()
        .int()
        .positive("El ID del usuario debe ser un número positivo."),

    fecha: z.string()
        .refine((date) => date < today, {
            message: "La fecha debe ser menor a la fecha de hoy.",
        }),

// Puede ser opcional si se genera automáticamente en la BD
});

// Tipo inferido por Zod
export type Escritura = z.infer<typeof escrituraSchema>;
