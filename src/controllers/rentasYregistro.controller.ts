import { Request, Response } from "express";
import { facturasModel } from "../models/facturas.model";
import { rentasYRegistroModel } from "../models/rentasYregistro.model";
import { rentasYRegistroSchema } from "../validations/rentasyregistro/rentasyregistroValidation";
import { formatValidationErrors } from "../validations/validationErrors";
;


// crear un caso de rentas y registro

const create_RentasyRegistro = async (req: Request, res: Response): Promise<void> => {
    // Validar la entrada con Zod usando safeParse
    const validationResult = rentasYRegistroSchema.safeParse(req.body);

    if (!validationResult.success) {
        res.status(400).json(formatValidationErrors(validationResult.error));
        return;
    }

    try {
        const {
            escritura_id,
            valor_rentas,
            metodo_pago_rentas,
            valor_registro = 0, // Asignar 0 si no se proporciona
            metodo_pago_registro,
            fecha,
            devoluciones,
            excedentes,
            observaciones,
            facturas
        } = validationResult.data;

        // Verificar si ya existe un registro asociado a la escritura

        const Vrentasyregistro = await rentasYRegistroModel.findByEscrituraId(escritura_id)
        if (Vrentasyregistro) {
            res.status(409).json({ error: "La escritura ya tiene un registro de rentas asociado." });
            return;
        }

        // Crear el registro de rentas y registro
        const rentasyregistro = await rentasYRegistroModel.createRentasYRegistro({
            escritura_id,
            valor_rentas,
            metodo_pago_rentas,
            valor_registro,
            metodo_pago_registro,
            fecha,
            devoluciones,
            excedentes,
            observaciones
        });

        if (!rentasyregistro) {
            res.status(500).json({ error: "No se pudo generar el registro de rentas." });
            return;
        }

        const rentasyregistro_id = rentasyregistro.id;

        // Insertar facturas asociadas
        try {
            await Promise.all(
                facturas.map(({ numero_factura, valor, estado }) =>
                    facturasModel.createFactura({ 
                        rentasyregistro_id,
                         numero_factura, 
                         valor, 
                         estado })
                )
            );
        } catch (error) {
            console.error("Error al insertar facturas:", error);
            res.status(500).json({ error: "Error interno del servidor al insertar facturas." });
            return;
        }

        res.status(201).json({ message: "Registro de rentas y facturas creados con éxito" });
    } catch (error) {
        console.error("Error en create_RentasyRegistro:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};




// actualizar un caso de rentas y registro
const updatedRentasyRegisgtro = async (req:Request, res:Response):Promise<void> => {
    const id = parseInt(req.params.id);
    //const { valor_rentas, metodo_pago_rentas, valor_registro, metodo_pago_registro,devoluciones,excedentes,observaciones } = req.body
    const updateFields = req.body;

    try {
        const existingCaso = await rentasYRegistroModel.findRentasYRegistroById(id);
        if (!existingCaso) {
            res.status(400).json({ error: "No existe el caso de rentas y registro." });
            return;
        } 
        
        // Combinar datos existentes con los nuevos, sin sobrescribir con `undefined`
        const updatedData = { ...existingCaso, ...Object.fromEntries(
            Object.entries(updateFields).filter(([_, value]) => value !== undefined)
        ) };

        const updatedRentas_y_Registro = await rentasYRegistroModel.updateRentasYRegistro(updatedData, id);

        //const updatedRentas_y_Registro = await rentasYRegistroModel.updateRentasYRegistro({valor_rentas, metodo_pago_rentas, valor_registro, metodo_pago_registro,devoluciones,excedentes,observaciones}, id);
        res.status(200).json({ message: "RentasYRegistro actualizado correctamente",updatedRentas_y_Registro });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}



// traer todos los casos de rentas y registro
const allRentasYRegistro = async (req:Request, res:Response): Promise<void> => {
    try {
        const data =  await rentasYRegistroModel.getRentas_y_Registro()
        res.status(200).json(data );
        
    } catch (error) {
         res.status(500).json({ error: 'Error interno del servidor'});
    }

}



export const rentasyregistroController = {
    create_RentasyRegistro,
    allRentasYRegistro,
    updatedRentasyRegisgtro
};
