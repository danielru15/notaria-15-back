import { Request, Response } from "express";
import { escriturasModel } from "../models/escrituras.model";
import { Escritura, escrituraSchema } from "../validations/escrituras/escriturasValidation";
import { authModel } from "../models/auth.model";
import { formatValidationErrors } from "../validations/validationErrors";

const create_Escritura = async (req: Request, res: Response):Promise<any> => {
    // Validar la entrada con Zod usando safeParse
    const validationResult = escrituraSchema.safeParse(req.body);
    
    
     if (!validationResult.success) {
            const formattedErrors = formatValidationErrors(validationResult.error);
            return res.status(400).json(formattedErrors);
        }

    try {
        // Extraer datos validados
        const { user_id, numero_escritura } = validationResult.data;

    
        // Verificar si el usuario existe 
        const existingUser = await  authModel.findOneById(user_id)

        if (!existingUser) {
            return res.status(409).json({ error: "El usuario no se encuentra registrado" });
        }


        // Verificar si la escritura ya existe 
        const existingEscritura = await escriturasModel.findOneByEscritura(numero_escritura )

        if (existingEscritura) {
            return res.status(409).json({ error: "La escritura ya se encuentra registrada" });
        }


        // Si  existe, continuar con la creación del usuario
        const EscrituraData: Escritura = validationResult.data;


        // Llamar al modelo para crear la escritura
        await escriturasModel.createEscritura(EscrituraData);
        return res.status(201).json({ mensaje: "Escritura creada con éxito" });

    } catch (error) {

        return res.status(500).json({ error});
    }
};




export const EscriturasController = {
    create_Escritura
};