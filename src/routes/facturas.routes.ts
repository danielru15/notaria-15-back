import { Router } from "express";
import { facturasController } from "../controllers/facturas.controller";


const Facturas = Router()


// -> /api/facturas/updated/:id
Facturas.put("/updated/:id", facturasController.updatedFactura)

// -> /api/facturas/get/:id
Facturas.get("/get/:id", facturasController.allFacturasById)



export default Facturas