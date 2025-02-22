import { Router } from "express";
import { CasoRentasController } from "../controllers/casoRentas.controller";
import { verifyEditor, verifyToken } from "../middleware/jwt.middleware";


const CasoRentasRoutes = Router()

// -> /api/escrituras/crear-caso-rentas
CasoRentasRoutes.post("/crear-caso-rentas",[verifyToken, verifyEditor], CasoRentasController.create_Caso_Rentas )


// -> /api/escrituras/update-caso-rentas
CasoRentasRoutes.put("/update-caso-rentas/:id", [verifyToken, verifyEditor], CasoRentasController.updateCasoRentasAll)

//
CasoRentasRoutes.get("/", CasoRentasController.allCasoRentas)


export default CasoRentasRoutes