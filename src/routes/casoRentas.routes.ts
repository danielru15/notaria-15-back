import { Router } from "express";
import { CasoRentasController } from "../controllers/casoRentas.controller";


const CasoRentasRoutes = Router()

// -> /api/escrituras/crear-caso-rentas
CasoRentasRoutes.post("/crear-caso-rentas", CasoRentasController.create_Caso_Rentas )


// -> /api/escrituras/update-caso-rentas
CasoRentasRoutes.put("/update-caso-rentas/:id", CasoRentasController.updateCasoRentasAll)

//
CasoRentasRoutes.get("/", CasoRentasController.allCasoRentas)


export default CasoRentasRoutes