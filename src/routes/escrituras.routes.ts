import { Router } from "express";
import { EscriturasController } from "../controllers/escrituras.controller";


const escriturasRoutes = Router()

// -> /api/escrituras/crear
.post("/crear", EscriturasController.create_Escritura)

export default escriturasRoutes