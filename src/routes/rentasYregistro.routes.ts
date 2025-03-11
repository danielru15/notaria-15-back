import { Router } from "express";
import { rentasyregistroController } from "../controllers/rentasYregistro.controller";



const RentasYRegistro = Router()

// -> /api/rentas_y_registro/crear
RentasYRegistro.post("/crear", rentasyregistroController.create_RentasyRegistro)

// -> /api/rentas_y_registro/get
RentasYRegistro.get("/get", rentasyregistroController.allRentasYRegistro)

// -> /api/rentas_y_registro/updated
RentasYRegistro.put("/updated/:id", rentasyregistroController.updatedRentasyRegisgtro)



export default RentasYRegistro