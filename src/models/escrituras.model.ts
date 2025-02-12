import { db } from "../config/conection.database";
import { Escritura } from "../interfaces/escrituras.interface";

// crea una escritura
const createEscritura = async ({numero_escritura, user_id, fecha }:Escritura ):Promise<string> => {
    const query = {
      text: `
        INSERT INTO escrituras (numero_escritura, user_id, fecha) 
        VALUES ($1, $2, $3)
        RETURNING id
      `,
      values: [numero_escritura, user_id, fecha],
    };
  
    const {rows} = await db.query(query)
    return rows[0]
  };


// udpate escritura




 // busca escritura por escritura
 const findOneByEscritura = async (numero_escritura:any):Promise<any> => {
  const query = {
      text: `
        SELECT numero_escritura FROM escrituras WHERE numero_escritura = $1
      `,
      values: [numero_escritura]
  }
  const { rows } = await db.query(query)
  return rows[0]
}

  export const escriturasModel = {
   createEscritura,
   findOneByEscritura
}