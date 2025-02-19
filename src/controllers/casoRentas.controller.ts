import { Request, Response } from "express";
import { Escritura } from "../validations/escrituras/escriturasValidation";
import { formatValidationErrors } from "../validations/validationErrors";
import { authModel } from "../models/auth.model";
import { escriturasModel } from "../models/escrituras.model";
import { casoRentasSchema, updateAllCasoRentasSchema, updateCasoRentasSchema } from "../validations/casoRentas/casoRentasValidation";
import { casoRentasModel } from "../models/casoRentas.model";
import sendEmail from "../config/email/sendEmail";


// crear caso de rentas
const create_Caso_Rentas = async (req: Request, res: Response): Promise<void> => {
    // Validar la entrada con Zod usando safeParse
    const validationResult = casoRentasSchema.safeParse(req.body);

    if (!validationResult.success) {
        const formattedErrors = formatValidationErrors(validationResult.error);
        res.status(400).json(formattedErrors);
        return; 
    }

    try {
        // Extraer datos validados
        const { user_id, numero_escritura, radicado, observaciones, fecha } = validationResult.data;

        // Verificar si el usuario existe
        const existingUser = await authModel.findOneById(user_id);
        if (!existingUser) {
            res.status(409).json({ error: "El usuario no se encuentra registrado. Por favor, registre un usuario primero." });
            return; 
        }

        // Verificar si la escritura ya existe
        const existingEscritura = await escriturasModel.findOneByEscritura(numero_escritura);
        if (existingEscritura) {
            res.status(409).json({ error: `La escritura ya se encuentra registrada y pertenece al protocolista ${existingEscritura.nombre_completo}.` });
            return; 
        }

        // Verificar si un caso de rentas ya existe
        const existingRadicado = await casoRentasModel.findOneByRadicado(radicado);
        if (existingRadicado) {
            res.status(409).json({ error: `Ya existe el radicado ${radicado} y pertenece a la escritura ${existingRadicado}.` });
            return; 
        }

        // Crear escritura y obtener el ID generado
        const escrituraData: Escritura = validationResult.data;
        const escrituraResponse = await escriturasModel.createEscritura(escrituraData);

        if (!escrituraResponse?.id) {
            res.status(500).json({ error: "No se pudo generar la escritura." });
            return; 
        }

        const escritura_id: number = escrituraResponse.id;

        // Crear caso de rentas con el ID de la escritura
        const casoRentaResponse = await casoRentasModel.createCasoRentas({
            escritura_id,
            radicado,
            observaciones,
        });

        const { name, last_name, email } = existingUser;

        if (casoRentaResponse) {
            // Datos para el correo
            const emailData = {
                to: email,
                subject: "Nuevo caso de rentas",
                templateFile: "nuevoCasoRentas",
                templateData: {
                    numero_escritura,
                    nombre: name.toUpperCase(),
                    apellido: last_name.toUpperCase(),
                    radicado,
                    fecha,
                },
            };

            try {
                // Intentar enviar correo
                await sendEmail(emailData);
            } catch (emailError) {
                // Si falla el envío del correo, responder con un mensaje de error
                console.error("Error al enviar correo:", emailError);
                res.status(500).json({ error: "El correo no pudo ser enviado, pero el caso de rentas se creó exitosamente." });
                return;
            }
        }

        // Responder con éxito
        res.status(201).json({ message: "Caso de rentas creado con éxito"});
    } catch (error) {
        console.error("Error en create_Caso_Rentas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}



const updateCasoRentasAll = async (req: Request, res: Response): Promise<void> => {
    const { confirmText, numero_escritura, radicado, observaciones, fecha, user_id, escritura_id } = req.body;

    const id = parseInt(req.params.id);

    // Validar la entrada con Zod usando el esquema exportado
    const validationResult = updateAllCasoRentasSchema.safeParse(req.body);

    if (!validationResult.success) {
        const formattedErrors = formatValidationErrors(validationResult.error);
        res.status(400).json(formattedErrors);
        return; 
    }

    if (confirmText !== "ACTUALIZAR") {
        res.status(400).json({error: "Palabra clave incorrecta." });
        return;
    }

    try {
        const existingCaso = await casoRentasModel.findOneById(id);
        if (!existingCaso) {
            res.status(400).json({ error: "No existe un caso de rentas." });
            return;
        }
         // Verificar si la escritura existe
         const existingEscrituraById = await escriturasModel.findscrituraById(escritura_id);
         if (!existingEscrituraById) {
             res.status(400).json({ error: "La escritura no existe." });
             return;
         }
         const existingEscritura = await escriturasModel.findOneByEscritura(numero_escritura)
         if (existingEscritura?.id !== escritura_id && existingEscritura !== null) {
            res.status(409).json({ error: `La escritura ya se encuentra registrada y pertenece al protocolista ${existingEscritura?.nombre_completo}.` });
            return; 
        }
        
        // Verificar si el radicado es distinto de la escritura
        const existingRadicado = await casoRentasModel.findOneByRadicado(radicado);
        if (existingRadicado  !== existingEscrituraById.numero_escritura && existingRadicado !== null) {
            res.status(400).json({ error: `El radicado pertenece a la escritura ${existingRadicado}. Por favor, proporcione un nuevo radicado.` });
            return;
        }

        // Verificar si el usuario existe
        const existingUser = await authModel.findOneById(user_id);
        if (!existingUser) {
            res.status(409).json({ error: "El usuario no existe." });
            return;
        }

        
       
        // Actualizar la escritura con el user_id proporcionado
       const updateEscritura = await escriturasModel.update_escrituras(numero_escritura, user_id, fecha, escritura_id);

        // Actualizar el caso de rentas con el nuevo radicado y observaciones
        const updateCasoRenta = await casoRentasModel.updateParcialCasoRentas(radicado, observaciones, id);

        const { name, last_name, email } = existingUser;
        if (existingRadicado  !== existingEscrituraById.numero_escritura  && updateCasoRenta) {
            // Datos para el correo
            const emailData = {
                to: email,
                subject: "Actualizacion de su Caso de Renats",
                templateFile: "updateCasoRentas",
                templateData: {
                    numero_escritura,
                    nombre: name.toUpperCase(),
                    apellido: last_name.toUpperCase(),
                    radicado,
                    fecha,
                },
            };

            try {
                // Intentar enviar correo
                await sendEmail(emailData);
            } catch (emailError) {
                // Si falla el envío del correo, responder con un mensaje de error
                console.error("Error al enviar correo:", emailError);
                res.status(500).json({ error: "El correo no pudo ser enviado, pero el caso de rentas se creó exitosamente." });
                return;
            }
        }

        // Responder con éxito
        res.status(200).json({ message: "Caso de Rentas y Escritura actualizados correctamente." });
    } catch (error) {
        console.error("Error en updateCasoRentas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};



// traer todos los casos rentas

const allCasoRentas = async (req:Request, res:Response): Promise<void> => {
    const {estado } = req.query
       // Verificar que el parámetro "estado" está presente
       if (!estado) {
        res.status(400).json({ error: 'El parámetro estado es obligatorio' });
        return;
    }

    try {
        const data =  await casoRentasModel.allCaso_Rentas(estado as string)
        res.status(200).json(data );
        
    } catch (error) {
         res.status(500).json({ error: 'Error interno del servidor'});
         return
    }

}


export const CasoRentasController = {
    create_Caso_Rentas,
    allCasoRentas,
    updateCasoRentasAll

};
