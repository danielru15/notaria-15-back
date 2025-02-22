import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";

/**
 * Extrae datos de un archivo PDF y los devuelve en formato JSON.
 * @param pdfPath Ruta del archivo PDF
 * @returns Objeto con los datos extraídos
 */
export const extractTextFromPDF = async (pdfPath: string) => {
    try {
        const dataBuffer = fs.readFileSync(pdfPath);
        const pdfData = await pdfParse(dataBuffer);
        const text = pdfData.text;
   

        // Extraer datos del texto


        const radicadoNumero = text.match(/RADICADO\s+N°\s+(\d+)/)?.[1] || null;
        /*
                const liquidacionNumero = text.match(/LIQUIDACIÓN\s+N°\s+(\d+)/)?.[1] || null;
        const fechaLiquidacion = text.match(/FECHA\s+LIQ:\s+(\d{2}\.\d{2}\.\d{4})/)?.[1] || null;
        const otorgadaPor = text.match(/OTORGADA\s+POR:\s+([\w\s.]+)/)?.[1]?.trim() || null;
        const otorgadaPorDoc = text.match(/Doc\.Id:\s+(NIT|CC)\s+(\d+)/);
        const otorgadaPorTipoDoc = otorgadaPorDoc?.[1] || null;
        const otorgadaPorNumDoc = otorgadaPorDoc?.[2] || null;
        const telefono = text.match(/TEL:\s+([\d\s]+)/)?.[1]?.trim() || null;
        const aFavorDe = text.match(/A\s+FAVOR\s+DE:\s+([\w\s.]+)/)?.[1]?.trim() || null;
        const aFavorDeDoc = text.match(/Doc\.Id:\s+(CC)\s+(\d+)/);
        const aFavorDeTipoDoc = aFavorDeDoc?.[1] || null;
        const aFavorDeNumDoc = aFavorDeDoc?.[2] || null;
        const clase = text.match(/CLASE:\s+([\w\s]+)/)?.[1]?.trim() || null;
        const numeroDocumento = text.match(/N°\s+DOC:\s+(\d+)/)?.[1] || null;
        const fechaDocumento = text.match(/FECHA\s+DOC\.\s+:\s+(\d{2}\.\d{2}\.\d{4})/)?.[1] || null;
        const matriculaInmobiliaria = text.match(/MATR\.\s+INM:\s+([\w-]+)/)?.[1]?.trim() || null;
        const totalPagar = text.match(/TOTAL\s+A\s+PAGAR:\s+\$(\d+[.,]?\d*)/)?.[1] || null;
        */

        return {
            radicado_numero: radicadoNumero,
           /*
            otorgada_por: {
                nombre: otorgadaPor,
                documento: {
                    tipo: otorgadaPorTipoDoc,
                    numero: otorgadaPorNumDoc
                },
                telefono: telefono
            },
            a_favor_de: {
                nombre: aFavorDe,
                documento: {
                    tipo: aFavorDeTipoDoc,
                    numero: aFavorDeNumDoc
                }
            },
            
            clase: clase,
            numero_documento: numeroDocumento,
            fecha_documento: fechaDocumento,
            matricula_inmobiliaria: matriculaInmobiliaria,
            total_pagar: totalPagar,
            */
        };
    } catch (error) {
        console.error("Error al procesar el PDF:", error);
        return { error: "No se pudo extraer información del PDF" };
    }
};

