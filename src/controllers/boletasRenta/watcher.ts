import chokidar from "chokidar";
import fs from "fs-extra";
import { extractTextFromPDF } from "./pdfProcesor";
import { casoRentasModel } from "../../models/casoRentas.model";
import { db } from "../../config/conection.database";
import sendEmail from "../../config/email/sendEmail";

// Definir la carpeta donde se subirán los archivos
const UPLOAD_FOLDER = "C:/Users/Pc-David/OneDrive - IUE/Desktop/uploads";
fs.ensureDirSync(UPLOAD_FOLDER); // Asegurar que la carpeta exista

// Conjunto para rastrear los PDFs procesados y evitar duplicados
let processedPDFs = new Set<string>();

// Número máximo de archivos que se procesarán simultáneamente
const MAX_CONCURRENCY = 7;
let activeTasks = 0; // Contador de tareas activas

// Función para obtener los radicados de los PDFs que ya fueron procesados
const getProcessedPDFs = async () => {
    const query = "SELECT radicado FROM caso_rentas WHERE pdf IS NOT NULL";
    const { rows } = await db.query(query);
    processedPDFs = new Set(rows.map(row => row?.radicado));
};

// Función que maneja la concurrencia y el procesamiento de cada archivo PDF
const processFileWithConcurrencyControl = async (filePath: string) => {
    // Esperar si se alcanzó el máximo de tareas activas
    while (activeTasks >= MAX_CONCURRENCY) {
        console.log('Máximo de tareas activas alcanzado, esperando...');
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    activeTasks++; // Incrementar el contador de tareas activas
    try {
        console.log(`Procesando archivo: ${filePath}`);

        // Extraer texto del PDF
        const extractedData = await extractTextFromPDF(filePath);
        const radicadoExtraido = extractedData.radicado_numero;

        if (!radicadoExtraido) {
            console.log("No se encontró un radicado en el PDF.");
            return;
        }

        // Verificar si el radicado ya fue procesado
        if (processedPDFs.has(radicadoExtraido)) {
            console.log(`El radicado ${radicadoExtraido} ya tiene un PDF registrado.`);
            return;
        }

        // Buscar el caso en la base de datos
        const casoRenta = await casoRentasModel.findOneByRadicado(radicadoExtraido);
        if (!casoRenta) {
            console.log(`Radicado ${radicadoExtraido} no encontrado en la base de datos.`);
            return;
        }

        // Actualizar la base de datos con el PDF procesado
        const success = await casoRentasModel.updatePdfCasoRentas(filePath, radicadoExtraido);
        if (!success) {
            console.log("Error al registrar el PDF en la base de datos.");
            return;
        }

        // Marcar el radicado como procesado
        processedPDFs.add(radicadoExtraido);

        // Enviar notificación por correo
        await sendEmailNotification(casoRenta, filePath);
        console.log(`PDF procesado y registrado para radicado: ${radicadoExtraido}`);
    } finally {
        activeTasks--; // Decrementar el contador de tareas activas al finalizar
    }
};

// Función para enviar notificación por correo con el PDF adjunto
const sendEmailNotification = async (casoRenta: any, filePath: string) => {
    // Formatear la fecha en la zona horaria de Bogotá
    const formattedDate = new Intl.DateTimeFormat('es-CO', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        timeZone: 'America/Bogota'
    }).format(casoRenta?.fecha);

    // Datos del correo
    const emailData = {
        to: casoRenta?.email,
        subject: "Boleta caso de rentas",
        templateFile: "boletaCasoRentas",
        templateData: {
            numero_escritura: casoRenta?.numero_escritura,
            nombre: casoRenta?.name.toUpperCase(),
            apellido: casoRenta?.last_name.toUpperCase(),
            radicado: casoRenta?.radicado,
            fecha: formattedDate,
        },
        attachments: [filePath] // Adjuntar el archivo PDF
    };
    console.log(emailData.attachments)
    try {
        await sendEmail(emailData);
        console.log(`Correo enviado correctamente a ${casoRenta?.email}`);
    } catch (error) {
        console.error("Error al enviar correo:", error);
    }
};

// Función autoejecutable para inicializar el monitoreo
(async () => {
    await getProcessedPDFs(); // Obtener lista de PDFs ya procesados
    console.log("Monitoreando carpeta de uploads...");

    // Configuración del watcher de archivos con Chokidar
    chokidar.watch(UPLOAD_FOLDER, {
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: { stabilityThreshold: 1000, pollInterval: 100 }
    }).on("add", async (filePath) => {
        // Verificar si el archivo es un PDF antes de procesarlo
        if (filePath.endsWith(".pdf")) {
            console.log(`Nuevo archivo detectado: ${filePath}`);
            await processFileWithConcurrencyControl(filePath);
        }
    });
})();

// Manejar la interrupción del proceso 
process.on("SIGINT", () => {
    console.log("Deteniendo el monitoreo de archivos...");
    process.exit(0);
});
