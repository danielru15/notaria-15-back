import { Request, Response } from "express";
import { clientesModel } from "../models/clientes.model";
import { formatValidationErrors } from "../validations/validationErrors";
import {clientesSchema, Clientes} from "../validations/clientes/clientesValidations"

// Crear una escritura
const create_Cliente = async (req: Request, res: Response):Promise<void> => {
    // Validar la entrada con Zod usando safeParse
    const validationResult = clientesSchema.safeParse(req.body);
    
    
     if (!validationResult.success) {
            const formattedErrors = formatValidationErrors(validationResult.error);
            res.status(400).json(formattedErrors);
            return
        }

    try {
        // Extraer datos validados
        const { nit } = validationResult.data;
        const existingNIT = await clientesModel.findOneByNIT(nit)
        const existingCliente = await clientesModel.findOneByCliente(nit )
        
        // Verificar si el usuario existe 
        if (!existingCliente) {
            res.status(409).json({ error: "El cliente no se encuentra registrado" });
            return
        }

        // Verificar si la escritura ya existe 
        if (existingNIT) {
            res.status(409).json({ error: "El cliente ya se encuentra registrado" });
            return
        }

        // Si  existe, continuar con la creación del cliente
        const ClientesData: Clientes = validationResult.data;


        // Llamar al modelo para crear el cliente
        await clientesModel.createClient(ClientesData);
        res.status(201).json({ mensaje: "Cliente creado con éxito" });

    } catch (error) {

        res.status(500).json({ error: "Error interno del servidor"});
    }
};

// todas las escrituras
const allClientes = async (req:Request, res:Response): Promise<void> => {
    try {
        const data =  await clientesModel.getAllClientes()
        res.status(200).json(data );
        
    } catch (error) {
         res.status(500).json({ error: 'Error interno del servidor'});
    }

};

// actualizar escrituras
const updateClientes = async (req: Request, res: Response): Promise<void> => {

    const validationResult = clientesSchema.safeParse(req.body);
    if (!validationResult.success) {
        const formattedErrors = formatValidationErrors(validationResult.error);
        res.status(400).json(formattedErrors);
        return
    }

    try {
        const  { nit, nombre_cliente} = validationResult.data;
        const id = parseInt(req.params.id)
        const existingNIT = await clientesModel.findOneByNIT(nit)
        
        // valida si el usuario existe
        
        if (!existingNIT) {
            res.status(404).json({ error: "Cliente no encontrado" });
            return
        }

        // valida si el cliente existe
        if(!existingNIT) {
            res.status(404).json({ error: "cliente no encontrado" });
            return
        }

        const updatedCliente = await clientesModel.update_cliente(nit, nombre_cliente, id);
        

        res.status(200).json({ message: "Cliente actualizado correctamente",updatedCliente });
    } catch (error) {
        console.error("Error al actualizar el cliente:", error);
        res.status(500).json({ error: "Error interno del servidor" });
        return
    }
};


export const clientesController = {
    create_Cliente,
    allClientes,
    updateClientes
};