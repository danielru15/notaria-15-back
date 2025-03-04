import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import transporter from "./emailConfig";

interface MailOptions {
  to: string;
  subject: string;
  templateFile: string;
  templateData?: Record<string, string>;
  attachments?: string[];
}

const sendEmail = async ({ to, subject, templateFile, templateData, attachments }: MailOptions) => {
  try {
    // Ruta del archivo HBS
    const templatePath = path.join(__dirname, "./templates", `${templateFile}.hbs`);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`El archivo ${templateFile}.hbs no existe.`);
    }

    // Leer y compilar la plantilla HBS
    const templateSource = fs.readFileSync(templatePath, "utf8");
    const compiledTemplate = handlebars.compile(templateSource);
    const htmlContent = compiledTemplate(templateData);

    const processedAttachments = attachments?.map((file: string) => {
      // Si es una ruta absoluta, la usa directamente; si es relativa, la busca en `/uploads`
      const filePath = path.isAbsolute(file) ? file : path.join(__dirname, "../uploads", file);
      
      return {
        filename: path.basename(file),
        path: filePath,
      };
    }) || [];
    // Configurar el correo
    const mailOptions = {
      from: "drestrepo@correo.iue.edu.co",
      to,
      subject,
      html: htmlContent,
      attachments: processedAttachments,
    };
    
    // Enviar el correo
    await transporter.sendMail(mailOptions);
 
  } catch (error) {
    console.log(error)
    throw new Error("No se pudo enviar el correo");
  }
};

export default sendEmail;
