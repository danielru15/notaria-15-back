import { text } from "express";
import { db } from "../config/conection.database";
import { RentasYRegistro } from "../interfaces/rentasYregistro.interface";

// Crear un registro en rentasyregistro
const createRentasYRegistro = async ({
  escritura_id,
  valor_rentas,
  metodo_pago_rentas,
  valor_registro,
  metodo_pago_registro,
  fecha,
  devoluciones,
  excedentes,
  observaciones
}: RentasYRegistro) => {
  const query = {
    text: `
      INSERT INTO rentasyregistro (
        escritura_id, valor_rentas, metodo_pago_rentas, valor_registro, metodo_pago_registro, 
        fecha, devoluciones, excedentes, observaciones
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `,
    values: [
      escritura_id, valor_rentas, metodo_pago_rentas, valor_registro, metodo_pago_registro,
      fecha, devoluciones, excedentes, observaciones
    ],
  };

  const { rows } = await db.query(query);
  return rows[0];
};

// Buscar un registro por id
const findRentasYRegistroById = async (id: number): Promise<RentasYRegistro> => {
  const query = {
    text: `SELECT * FROM rentasyregistro WHERE id = $1`,
    values: [id]
  };
  const { rows } = await db.query(query);
  return rows[0];
};

// Buscar una escritura asociada a un caso de rentasyregistro
const findByEscrituraId = async (escritura_id: number) => {
    const query = {
      text: `
        SELECT * FROM rentasyregistro 
        WHERE escritura_id = $1 
        AND EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
        LIMIT 1
      `,
      values: [escritura_id],
    };
  
    const { rows } = await db.query(query);
    return rows[0] || null;
  };

// Actualizar un registro de rentasyregistro
const updateRentasYRegistro = async ({
  valor_rentas,
  metodo_pago_rentas,
  valor_registro,
  metodo_pago_registro,
  devoluciones,
  excedentes,
  observaciones,
}: RentasYRegistro , id:number) => {
  const query = {
    text: `
      UPDATE rentasyregistro SET 
        valor_rentas = $1, metodo_pago_rentas = $2, valor_registro = $3, metodo_pago_registro = $4,
        devoluciones = $5, excedentes = $6, observaciones = $7
      WHERE id = $8
      RETURNING *
    `,
    values: [
      valor_rentas, metodo_pago_rentas, valor_registro, metodo_pago_registro,
      devoluciones, excedentes, observaciones,  id
    ],
  };

  const { rows } = await db.query(query);
  return rows[0];
}


// traer todos los casos de rentas y registro
const getRentas_y_Registro = async () => {
  const query = {
    text:`
    SELECT 
        users.id,
        CONCAT(users.name, ' ', users.last_name) AS nombre_completo,
        escrituras.id,
        escrituras.numero_escritura,
        escrituras.fecha,
        rentasyregistro.id,
        rentasyregistro.valor_rentas,
        rentasyregistro.metodo_pago_rentas,
        rentasyregistro.valor_registro,
        rentasyregistro.metodo_pago_registro,
        rentasyregistro.fecha,
        rentasyregistro.total_facturas_canceladas,
        rentasyregistro.total_facturas_sin_cancelar,
        rentasyregistro.total_ryr,
        rentasyregistro.devoluciones,
        rentasyregistro.excedentes,
        rentasyregistro.observaciones,
        rentasyregistro.total_rentasyregistro
    FROM 
        users
    JOIN 
        escrituras 
        ON users.id = escrituras.user_id
    JOIN 
        rentasyregistro 
        ON escrituras.id = rentasyregistro.escritura_id;
    `
  }
  const { rows } = await db.query(query);
  return rows;
}

export const rentasYRegistroModel = {
  createRentasYRegistro,
  findRentasYRegistroById,
  updateRentasYRegistro,
  findByEscrituraId,
  getRentas_y_Registro
};
