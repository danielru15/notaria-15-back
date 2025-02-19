import { db } from "../config/conection.database";
import { CasoRentas, CasoRentasResponse } from "../interfaces/casoRentas.interface";

// Operaciones relacionadas con la creación y actualización de casos de rentas
const createCasoRentas = async ({ escritura_id, radicado, observaciones }: CasoRentas) => {
  const query = {
    text: `
      INSERT INTO caso_rentas (escritura_id, radicado, observaciones) 
      VALUES ($1, $2, $3)
      RETURNING *
    `,
    values: [escritura_id, radicado, observaciones],
  };

  const { rows } = await db.query(query);
  return rows[0];
};

const updateParcialCasoRentas = async (radicado: string, observaciones: string, id: number) => {
  const query = {
    text: `
      UPDATE caso_rentas 
      SET radicado = $1, observaciones = $2
      WHERE id = $3
    `,
    values: [radicado, observaciones, id],
  };

  const { rows } = await db.query(query);
  return rows;
};

const updateEstadoCasoRentas = async (id: number) => {
  const query = {
    text: `
      UPDATE caso_rentas 
      SET estado = 'finalizado' 
      WHERE id = $1
    `,
    values: [id],
  };

  const { rows } = await db.query(query);
  return rows[0];
};

const updatePdfCasoRentas = async (id: number) => {
  const query = {
    text: `
      UPDATE caso_rentas 
      SET pdf = true 
      WHERE id = $1
    `,
    values: [id],
  };

  const { rows } = await db.query(query);
  return rows[0];
};

// Operaciones relacionadas con la búsqueda de casos de rentas
const findOneByRadicado = async (radicado: string) => {
  const query = {
    text: `
      SELECT 
        escrituras.numero_escritura
      FROM caso_rentas 
      JOIN escrituras ON caso_rentas.escritura_id = escrituras.id
      JOIN users ON escrituras.user_id = users.id
      WHERE caso_rentas.radicado = $1;
    `,
    values: [radicado],
  };

  const { rows } = await db.query(query);
  return rows[0]?.numero_escritura || null;
};

const findOneById = async (id: number) => {
  const query = {
    text: `
      SELECT 
        escrituras.numero_escritura
      FROM caso_rentas 
      JOIN escrituras ON caso_rentas.escritura_id = escrituras.id
      JOIN users ON escrituras.user_id = users.id
      WHERE caso_rentas.id = $1;
    `,
    values: [id],
  };

  const { rows } = await db.query(query);
  return rows[0]?.numero_escritura || null;
};

const allCaso_Rentas = async (estado: string): Promise<CasoRentasResponse[]> => {
  const query = {
    text: `
      SELECT 
        caso_rentas.id,                    
        caso_rentas.radicado,        
        caso_rentas.observaciones,       
        caso_rentas.estado,              
        caso_rentas.pdf,
        escrituras.numero_escritura, 
        escrituras.fecha,
        escrituras.id AS escritura_id,
        users.id AS user_id,
        users.name,                
        users.last_name,         
        users.email 
      FROM caso_rentas
      JOIN escrituras ON caso_rentas.escritura_id = escrituras.id  
      JOIN users ON escrituras.user_id = users.id  
      WHERE caso_rentas.estado = $1
      ORDER BY caso_rentas.created_at DESC;

    `,
    values: [estado],
  };

  const { rows } = await db.query(query);
  return rows;
};

// Exportar todas las funciones como un objeto
export const casoRentasModel = {
  createCasoRentas,
  findOneByRadicado,
  updateParcialCasoRentas,
  updateEstadoCasoRentas,
  updatePdfCasoRentas,
  findOneById,
  allCaso_Rentas,
};