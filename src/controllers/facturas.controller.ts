import { Request, Response } from "express";
import { facturasModel } from "../models/facturas.model";



const updatedFactura = async (req:Request, res:Response):Promise<void> => {
    const id = parseInt(req.params.id)
    const {valor, estado} = req.body;
    const existingfactura = facturasModel.findFacturaById(id)
    if(!existingfactura) {
        res.status(400).json({error: "No se encontro una factura"})
        return
    }
    try {
        
        const updated_Factura = await facturasModel.update_Facturas(valor, estado, id)
        res.status(200).json({ message: "factura actualizada correctamente",updated_Factura })

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }

}



const allFacturasById = async (req:Request, res:Response): Promise<void> => {
    const id = parseInt(req.params.id);
    try {
        const data =  await facturasModel.getFacturasById(id)
        res.status(200).json(data );
        
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor'});
        return
    }

}





export const facturasController = {
    allFacturasById,
    updatedFactura

}