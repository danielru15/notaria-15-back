import { db } from "../config/conection.database";
import { Escritura } from "../interfaces/escrituras.interface";

// crea una escritura
const createEscritura = async ({numero_escritura, user_id, fecha }:Escritura ):Promise<Escritura> => {
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




 // Busca escritura por número de escritura
 const findOneByEscritura = async (numero_escritura: string): Promise<{ id: number, nombre_completo: string } | null> => {
  const query = {
    text: `
      SELECT 
          escrituras.id,
          CONCAT(usuarios.name, ' ', usuarios.last_name) AS nombre_completo
      FROM escrituras
      JOIN users AS usuarios ON escrituras.user_id = usuarios.id
      WHERE escrituras.numero_escritura = $1;
    `,
    values: [numero_escritura],
  };

  const { rows } = await db.query(query);
  return rows[0] ? { id: rows[0].id, nombre_completo: rows[0].nombre_completo } : null;
};



 // busca escritura por id
 const findscrituraById = async (id:number):Promise<Escritura> => {
  const query = {
      text: `
        SELECT numero_escritura FROM escrituras WHERE id = $1
      `,
      values: [id]
  }
  const { rows } = await db.query(query)
  return rows[0]
}

// traer todas las escrituraa con nombre de usuario

const getAllEscrituras = async ():Promise<Escritura[]> => {
  /*
    -- Consulta que obtiene la información de las escrituras junto con los datos del usuario asociado.  
    -- Se unen las tablas `escrituras` y `users` para recuperar el número y la fecha de la escritura,  
    -- así como el nombre , apellido del usuario  y email que la registró.
  */

  const query = {
    text: `
      SELECT 
          escrituras.id AS escritura_id, 
          escrituras.numero_escritura AS numero_de_escritura, 
          escrituras.fecha AS fecha_de_escritura, 
          usuarios.id AS usuario_id,
          usuarios.name AS nombre_usuario, 
          usuarios.last_name AS apellido_usuario,
          usuarios.email AS email
      FROM escrituras
      JOIN users AS usuarios ON escrituras.user_id = usuarios.id
      ORDER BY escrituras.fecha DESC;

    `,
  }
  const { rows } = await db.query(query)
  return rows
}


const update_escrituras = async ( numero_escritura:any, user_id:number, fecha:string, id:number):Promise<Escritura[]>=> {
  const query = {
    text: `
      UPDATE escrituras SET numero_escritura=$1, user_id=$2 , fecha=$3
      WHERE id=$4
      RETURNING *
    `,
    values: [numero_escritura, user_id, fecha, id]
  }
  const { rows } = await db.query(query)
  return rows
}

  export const escriturasModel = {
    createEscritura,
    findOneByEscritura,
    getAllEscrituras,
    update_escrituras,
    findscrituraById
  }