import { z } from "zod";

// Esquema de validación con Zod
export const userCreateValidate = z.object({
    name: z.string()
        .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
        .regex(/^[^0-9]*$/, { message: "El nombre no puede contener números" }),
    last_name: z.string()
        .min(3, { message: "El apellido debe tener al menos 3 caracteres" })
        .regex(/^[^0-9]*$/, { message: "El nombre no puede contener números" }),
    email: z.string()
        .email({ message: "El correo electrónico no es válido" }),
    password: z.string()
        .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
        .regex(/[a-z]/, { message: "La contraseña debe tener al menos una letra minúscula" })
        .regex(/[A-Z]/, { message: "La contraseña debe tener al menos una letra mayúscula" })
        .regex(/[0-9]/, { message: "La contraseña debe tener al menos un número" }),
    cargo: z.string(),
    rol: z.enum(["ADMIN", "EDITOR", "VIEWER"]),
});
// Extraer solo la validación de email y password para reutilizar en login
export const userLoginValidate = userCreateValidate.pick({ email: true, password: true });

// Tipo para usuario basado en el esquema de Zod
export type UserType = z.infer<typeof userCreateValidate>;
export type UserLoginType = z.infer<typeof userLoginValidate>;