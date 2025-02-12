import {  Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import { RequestWithEmail } from '../interfaces/requesWithemail.interface';
const SECRET_KEY = "claveSecretaSuperSegura";

interface JwtPayload {
    email: string; // Agrega otros campos que estés utilizando en tu payload
    rol:string
}

// verifica el token 
export const verifyToken = (req: RequestWithEmail, res: Response, next: NextFunction): any => {
    let token = req.cookies.token;

    // Si no se proporciona un token, se devuelve un error 401 (No autorizado)
    if (!token) {
        return res.status(401).json({ error: "Token not provided" });
    }

    // Verifica y decodifica el token usando la clave secreta
    const { email, rol } = jwt.verify(token, SECRET_KEY) as JwtPayload;
    console.log(rol);

    // Almacena la información del usuario en el objeto de la solicitud para su uso posterior
    req.email = email;
    req.rol = rol;

    // Continúa con el siguiente middleware
    next();
};


// verifica rol ADMIN
export const verifyAdmin = (req: RequestWithEmail, res: Response, next: NextFunction): any => {
    // Verifica si el usuario tiene el rol de ADMIN
    if (req.rol !== "ADMIN") {
        return res.status(403).json({ error: "Access denied. Admins only." });
    }

    // Si es ADMIN, permite continuar con la ejecución del siguiente middleware
    next();
};

//Verifica si el rol es admin o editor
export const verifyEditor = (req: RequestWithEmail, res: Response, next: NextFunction) => {
    // Verifica si el usuario tiene el rol de ADMIN o EDITOR
    if (req.rol !== "ADMIN" && req.rol !== "EDITOR") {
        return res.status(403).json({ error: "No autorizado, solo ADMIN y EDITOR pueden acceder." });
    }

    // Si cumple con los roles permitidos, pasa al siguiente middleware
    next();
};


