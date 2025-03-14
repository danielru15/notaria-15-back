import { Router } from "express";
import { clientesController } from "../controllers/clientes.controller";


const clientesRoutes = Router()

// -> /api/clientes/crear
clientesRoutes.post("/crear", clientesController.create_Cliente)


// -> /api/clientes/
clientesRoutes.get("/", clientesController.allClientes)


// -> /api/clientes/:id
clientesRoutes.put("/:id", clientesController.updateClientes)



export default clientesRoutes