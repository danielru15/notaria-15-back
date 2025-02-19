import { z } from "zod";

// Función para organizar los errores de validación
export const formatValidationErrors = (error: z.ZodError): { error: string } => {
    // Devolvemos el primer error encontrado como un objeto con el campo "error"
    return {
        error: error.errors[0].message,
    };
};
