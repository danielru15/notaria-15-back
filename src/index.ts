 import express from "express"
import { db } from "./config/conection.database";
import authRoutes from "./routes/auth.routes";
import cors from 'cors';
import cookieParser from "cookie-parser";
import escriturasRoutes from "./routes/escrituras.routes";
import Mailrouter from "./routes/mail.routes";
import CasoRentasRoutes from "./routes/casoRentas.routes";


 const PORT = 5000;
 const app = express()
 app.use(express.json())
 app.use(express.urlencoded({ extended: true }));
 app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true, // Permitir cookies y autenticación en solicitudes
    })
  );
 app.use(cookieParser())
 
  // Verifica conexion servidor
 app.listen(PORT, () => {
    console.log(`Servidor corriendo en: ${PORT}`);
  });

  //verifica conexion base de datos
async function testDbConnection() {
    try {
        await db.query('SELECT NOW()')
        console.log('DATABASE connected')
    } catch (error) {
        console.error('Database connection error:', error)
    }
}

testDbConnection()

// rutas users
app.use("/api/users" , authRoutes)

// rutas escrituras
app.use("/api/escrituras" , escriturasRoutes)

// rutas escrituras
app.use("/api/escrituras" , escriturasRoutes)

// rutas caso rentas
app.use("/api/caso-rentas" , CasoRentasRoutes)

// rutas mail
app.use("/api/mail", Mailrouter); // Cargar rutas