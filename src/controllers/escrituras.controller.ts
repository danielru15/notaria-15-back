import { Request, Response } from "express";
import { escriturasModel } from "../models/escrituras.model";
import { Escritura, escrituraSchema } from "../validations/escrituras/escriturasValidation";
import { authModel } from "../models/auth.model";
import { formatValidationErrors } from "../validations/validationErrors";

// Crear una escritura
const create_Escritura = async (req: Request, res: Response):Promise<void> => {
    // Validar la entrada con Zod usando safeParse
    const validationResult = escrituraSchema.safeParse(req.body);
    
    
     if (!validationResult.success) {
            const formattedErrors = formatValidationErrors(validationResult.error);
            res.status(400).json(formattedErrors);
            return
        }

    try {
        // Extraer datos validados
        const { user_id, numero_escritura } = validationResult.data;
        const existingUser = await  authModel.findOneById(user_id)
        const existingEscritura = await escriturasModel.findOneByEscritura(numero_escritura )
        
        // Verificar si el usuario existe 
        if (!existingUser) {
            res.status(409).json({ error: "El usuario no se encuentra registrado" });
            return
        }

        // Verificar si la escritura ya existe 
        if (existingEscritura) {
            res.status(409).json({ error: "La escritura ya se encuentra registrada" });
            return
        }

        // Si  existe, continuar con la creación de la escritura
        const EscrituraData: Escritura = validationResult.data;


        // Llamar al modelo para crear la escritura
        await escriturasModel.createEscritura(EscrituraData);
        res.status(201).json({ mensaje: "Escritura creada con éxito" });

    } catch (error) {

        res.status(500).json({ error: "Error interno del servidor"});
    }
};


// todas las escrituras
const allEscrituas = async (req:Request, res:Response): Promise<void> => {
    try {
        const data =  await escriturasModel.getAllEscrituras()
        res.status(200).json(data );
        
    } catch (error) {
         res.status(500).json({ error: 'Error interno del servidor'});
    }

}

// actualizar escrituras
const updateEscrituras = async (req: Request, res: Response): Promise<void> => {

    const validationResult = escrituraSchema.safeParse(req.body);
    if (!validationResult.success) {
        const formattedErrors = formatValidationErrors(validationResult.error);
        res.status(400).json(formattedErrors);
        return
    }

    try {
        const  { numero_escritura, user_id, fecha} = validationResult.data;
        const id = parseInt(req.params.id)
        const existingUser = await authModel.findOneById(user_id);
        const existingEscritura = await escriturasModel.findscrituraById(id )
        
        // valida si el usuario existe
        
        if (!existingUser) {
            res.status(404).json({ error: "Usuario no encontrado" });
            return
        }

        // valida si la esscritura existe
        if(!existingEscritura) {
            res.status(404).json({ error: "escritura no encontrada" });
            return
        }

        const updatedEscritura = await escriturasModel.update_escrituras(numero_escritura, user_id, fecha, id);
        

        res.status(200).json({ message: "Escritura actualizada correctamente",updatedEscritura });
    } catch (error) {
        console.error("Error al actualizar la escritura:", error);
        res.status(500).json({ error: "Error interno del servidor" });
        return
    }
};





export const EscriturasController = {
    create_Escritura,
    allEscrituas,
    updateEscrituras
};