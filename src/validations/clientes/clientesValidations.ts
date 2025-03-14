import { z } from "zod";

export const clientesSchema = z.object({
    nit: z.string()
        .max(15, "El número de nit no puede tener más de 15 caracteres.")
        .regex(/^\d+$/, "El nit debe contener solo dígitos."), // Solo números

    nombre_cliente: z.string()
    .max(50, "El nombre del cliente no puede tener más de 50 caracteres.")
    

// Puede ser opcional si se genera automáticamente en la BD
});

// Tipo inferido por Zod
export type Clientes = z.infer<typeof clientesSchema>;