import { db } from "../config/conection.database";
import { Clientes } from "../interfaces/clientes.interface";

const createClient = async ({ nombre_cliente, nit }: Clientes): Promise<Clientes> => {
    const query = {
      text: `
        INSERT INTO clientes (nombre_cliente, nit) 
        VALUES ($1, $2)
        RETURNING id
      `,
      values: [nombre_cliente, nit],
    };

    const { rows } = await db.query(query);
    return rows[0];
};

//  Buscar un cliente por NIT
const findOneByNIT = async (nit: string): Promise<{ id: number, nombre_cliente: string } | null> => {
    const query = {
      text: `
        SELECT id, nit 
        FROM clientes
        WHERE nit = $1;
      `,
      values: [nit],
    };
  
    const { rows } = await db.query(query);
    return rows[0] ? rows[0] : null;
  };

  //  Buscar un cliente por nombre
  const findOneByCliente = async (nit: string): Promise<{ id: number, nombre_cliente: string } | null> => {
    const query = {
      text: `
        SELECT id, nombre_cliente 
        FROM clientes
        WHERE nombre_cliente = $1;
      `,
      values: [nit],
    };
  
    const { rows } = await db.query(query);
    return rows[0] ? rows[0] : null;
  };

  //  Obtener todos los clientes
const getAllClientes = async (): Promise<Clientes[]> => {
    const query = {
      text: `
        SELECT * FROM clientes
        ORDER BY nombre_cliente ASC;
      `,
    };
    const { rows } = await db.query(query);
    return rows;
  };

  //  Actualizar un cliente
const updateClient = async (
    nombre_cliente: string, 
    nit: string, 
    id: number
  ): Promise<Clientes[]> => {
    const query = {
      text: `
        UPDATE clientes 
        SET nombre_cliente=$1, nit=$2
        WHERE id=$3
        RETURNING *
      `,
      values: [nombre_cliente, nit, id],
    };
    const { rows } = await db.query(query);
    return rows;
  };

  export const clientesModel = {
    createClient,
    findOneByNIT,
    getAllClientes,
    updateClient,
    findOneByCliente
  };