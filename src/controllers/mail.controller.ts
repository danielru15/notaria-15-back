import { Request, Response } from "express";
import sendEmail from "../config/email/sendEmail";



// Función para enviar correo con adjuntos
const sendEmails = async (req: Request, res: Response) => {
   const { to, subject,templateFile, templateData, attachments } = req.body;
   

  try {
    await sendEmail({ to, subject, templateFile, templateData , attachments})
    res.status(201).json({message: "Correo enviado con éxito" });

  } catch (error) {
    
    res.status(500).json({ success: false, message: "Error enviando el correo" });
  }
};

// Exportar controlador
export const MailController = {
    sendEmails
};
