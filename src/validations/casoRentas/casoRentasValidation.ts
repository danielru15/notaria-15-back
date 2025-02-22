import { z } from "zod";

// Obtener la fecha de hoy en formato 'YYYY-MM-DD'
const today = new Date().toISOString().split("T")[0];

export const casoRentasSchema = z.object({
    numero_escritura: z.string()
        .max(5, "El número de escritura no puede tener más de 5 caracteres.")
        .regex(/^\d+$/, "El número de escritura debe contener solo dígitos."), // Solo números

    user_id: z.number()
        .int()
        .positive("El ID del usuario debe ser un número positivo."),

    fecha: z.string()
        .refine((date) => date <= today, {
            message: "La fecha debe ser menor o igual a la fecha de hoy.",
        }),

    radicado: z.string()
        .min(1, "El radicado es obligatorio.")
        .max(50, "El radicado no puede tener más de 50 caracteres.")
        .regex(/^\d+$/, "El radicado debe contener solo números."),

    observaciones: z.string().optional(),

    estado: z.enum(["activo", "finalizado"]).optional(), 

    pdf: z.boolean().optional() 
});

export const updateCasoRentasSchema = casoRentasSchema.pick({
    radicado: true,
    observaciones: true
}).extend({
    observaciones: z.string().default("")
})


export const updateAllCasoRentasSchema = z.object({
    confirmText: z.string()
      .refine(val => val === "ACTUALIZAR", { message: "Palabra clave incorrecta." }),
  
    numero_escritura: z.string()
      .max(5, "El número de escritura no puede tener más de 5 caracteres.")
      .regex(/^\d+$/, "El número de escritura debe contener solo dígitos."),
  
    radicado: z.string()
      .min(1, "El radicado es obligatorio.")
      .max(50, "El radicado no puede tener más de 50 caracteres.")
      .regex(/^\d+$/, "El radicado debe contener solo números."),
  
    observaciones: z.string().optional(),
  
    fecha: z.string()
      .refine((date) => date < today, {
        message: "La fecha debe ser menor a la fecha de hoy.",
      }),
  
    user_id: z.number()
      .int()
      .positive("El ID del usuario debe ser un número positivo."),
  
    escritura_id: z.number()
      .int()
      .positive("El ID de la escritura debe ser un número positivo.")
  });

// Tipo inferido por Zod
export type caso_Rentas = z.infer<typeof casoRentasSchema>;
export type UpdateCasoRentasType = z.infer<typeof updateCasoRentasSchema>;