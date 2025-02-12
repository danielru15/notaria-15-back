import { Request, Response } from "express";
import { authModel } from "../models/auth.model";
import { userCreateValidate, UserLoginType, userLoginValidate, UserType } from "../validations/userValidations/userAuthValidation";
import { formatValidationErrors } from "../validations/validationErrors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RequestWithEmail } from "../interfaces/requesWithemail.interface";

const SECRET_KEY = "claveSecretaSuperSegura";

// crear usuario
const createNewUser = async (req: Request, res: Response): Promise<any> => {
    // Validación con safeParse para manejar errores sin excepciones
    const validationResult = userCreateValidate.safeParse(req.body);

    // Si la validación falla, devolver los errores de forma clara
    if (!validationResult.success) {
        const formattedErrors = formatValidationErrors(validationResult.error);
        return res.status(400).json(formattedErrors);
    }

    // Accede al email desde el body de la petición
    const { email } = req.body;

    // Verificar si el email ya existe en la base de datos
    try {
        const existingUser = await authModel.findOneByEmail(email);
        if (existingUser) {
            console.log("Correo ya registrado:", email); // Verificar que el correo ya está registrado
            return res.status(409).json({ error: "El correo electrónico ya está registrado" });
        }

        // Si no existe, continuar con la creación del usuario
        const userData: UserType = validationResult.data;

        // Generar el salt para la contraseña
        const salt = await bcrypt.genSalt(10);
        // Generar el hash de la contraseña usando el salt
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        // Crear el usuario con la contraseña hasheada
        const userWithHashedPassword = { ...userData, password: hashedPassword };
        await authModel.createUser(userWithHashedPassword);

        return res.status(201).json({ mensaje: "Usuario creado con éxito" });
    } catch (error) {
        console.error("Error al crear el usuario:", error);

        // Manejar errores internos, si existen
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};
// login de usuario
const loginUser = async (req: Request, res: Response): Promise<any> => {
    // Validar los datos con Zod
    const validationResult = userLoginValidate.safeParse(req.body);

    if (!validationResult.success) {
        const formattedErrors = formatValidationErrors(validationResult.error);
        return res.status(400).json(formattedErrors);
    }

    try {
        const { email, password }: UserLoginType = validationResult.data;

        // Buscar usuario por email en la base de datos
        const user = await authModel.findOneByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        // Comparar la contraseña ingresada con la almacenada en la BD
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }
            // Generar el token JWT con una duración de 1 hora
            const token = jwt.sign(
                { id: user.id, email: user.email, rol: user.rol }, // Datos en el payload
                SECRET_KEY,
                { expiresIn: "1h" } // Expira en 1 hora
            );
            
            // Configurar la cookie con una duración de 1 hora
            res.cookie("token", token, {
                httpOnly: true,        // No accesible desde JS
                secure: true,          // Requiere HTTPS
                maxAge: 60 * 60 * 1000, // 1 hora en milisegundos (3,600,000 ms)
            });
  

        return res.status(200).json({ mensaje: "Login exitoso" , token, user});

    } catch (error) {
        console.error("Error en el login:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};


// traer el perfil usuario login
const profile = async (req: RequestWithEmail, res: Response): Promise<any> => {
    try {
        // Accedemos a req.email que ahora es válido
        const user = await authModel.findOneByEmail(req.email);
        return res.status(200).json({ user });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: 'Error server'
        });
    }
};
// cerrar sesion
const logout = async (req:Request, res:Response) => {
    res.clearCookie('token')
    .json({message:"logout exitoso"})
}
// todos los usuarios
const allUsers = async (req:Request, res:Response): Promise<any> => {
    try {
        const data =  await authModel.getAllUsers()
        return res.status(200).json(data );
        
    } catch (error) {
        return res.status(500).json({
            error: 'Error server'
        });
    }

}
// eliminar usuario
const deleteUser = async (req:Request, res:Response):Promise<any> => {
    const id = parseInt(req.params.id)
    const { confirmText } = req.body; 
    
    if (confirmText !== "ELIMINAR") {
        return res.status(400).json({ message: "Palabra clave incorrecta." });
      }

    try {
        const data =  await authModel.delete_User(id)
        return res.status(200).json("Usuario eliminado correctamente" )
    } catch (error) {
        return res.status(500).json({
            error: 'Error server'
        });
    }

}

const updatePartialUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = parseInt(req.params.id)
        const { rol, cargo, email } = req.body;

        if (!rol || !cargo) {
            return res.status(400).json({ error: "Rol y cargo son requeridos" });
        }

        const user = await authModel.findOneByEmail(email);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const updatedUser = await authModel.update_parcial_info(cargo, rol, id);

        return res.status(200).json({ message: "Usuario actualizado correctamente", updatedUser });
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};
// Exportación del controlador
export const AuthController = {
    createNewUser,
    loginUser, 
    profile,
    logout,
    allUsers,
    deleteUser,
    updatePartialUser
};
