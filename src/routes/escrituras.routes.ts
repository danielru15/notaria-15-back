import { Router } from "express";
import { EscriturasController } from "../controllers/escrituras.controller";


const escriturasRoutes = Router()

// -> /api/escrituras/crear
escriturasRoutes.post("/crear", EscriturasController.create_Escritura)


// -> /api/escrituras/
escriturasRoutes.get("/", EscriturasController.allEscrituas)


// -> /api/escrituras/:id
escriturasRoutes.put("/:id", EscriturasController.updateEscrituras)



export default escriturasRoutes