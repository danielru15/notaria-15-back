import { Router } from "express";
import { MailController } from "../controllers/mail.controller";


const Mailrouter = Router();


// creacion caso rentas
Mailrouter.post("/send-email", MailController.sendEmails);


export default Mailrouter