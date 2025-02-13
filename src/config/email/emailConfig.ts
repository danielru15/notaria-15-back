import nodemailer from "nodemailer";
import { create } from "express-handlebars";
import hbs from "nodemailer-express-handlebars";
import path from "path";


// Configuración del transportador SMTP
 const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
        user: "daniel_ramirezur@virtual.ceipa.edu.co",
        pass: "Dr1152217356",
    },
    
});


// Verificar conexión con el servidor SMTP
transporter.verify((error) => {
  if (error) {
    console.error("Error al conectar con el servidor SMTP:", error);
  } else {
    console.log("Servidor SMTP listo para enviar correos.");
  }
});
// Configurar Handlebars como motor de plantillas
const hbsEngine = create({
    extname: ".hbs",
    partialsDir: path.resolve(__dirname, "./templates"),
    defaultLayout: false,
  });
  
  // Configuración de Handlebars en Nodemailer
  const handlebarsOptions = {
    viewEngine: hbsEngine,
    viewPath: path.resolve(__dirname, "./templates"),
    extName: ".hbs",
  };
  
  
  
  transporter.use("compile", hbs(handlebarsOptions))
  
  export default transporter;
