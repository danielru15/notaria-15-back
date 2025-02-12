import { z } from "zod";

// Tipo para los errores de validación formateados
export type ValidationErrors = {
    [key: string]: string;
};

// Función para organizar los errores de validación
export const formatValidationErrors = (error: z.ZodError): ValidationErrors => {
    // Aquí devolvemos directamente un objeto con los errores formateados
    return error.errors.reduce((acc: ValidationErrors, e) => {
        acc[e.path.join('.')] = e.message; // Usamos el path como clave y el mensaje como valor
        return acc;
    }, {});
};

