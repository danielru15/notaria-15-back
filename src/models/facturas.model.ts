import { db } from "../config/conection.database";
import { Factura } from "../interfaces/factura.interface";


// crear factura
const createFactura = async ({rentasyregistro_id, numero_factura, valor, estado}:Factura) => {
  const query = {
    text: `
      INSERT INTO facturas (rentasyregistro_id, numero_factura, valor, estado) 
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    values: [rentasyregistro_id, numero_factura, valor, estado],
  };

  const { rows } = await db.query(query);
  return rows[0];
};


// Buscar factura por id
 const findFacturaById = async (id:number):Promise<Factura> => {
  const query = {
      text: `
        SELECT * FROM facturas WHERE id = $1

      `,
      values: [id]
  }
  const { rows } = await db.query(query)
  return rows[0]
}


// buscar factura por numero factura
const findFacturaByFactura = async (numero_factura:string):Promise<Factura> => {
    const query = {
        text: `
          SELECT * FROM facturas WHERE numero_factura = $1
        `,
        values: [numero_factura]
    }
    const { rows } = await db.query(query)
    return rows[0]
  }

// actualizar factura 
const update_Facturas = async ( valor:number, estado:string, id:number)=> {
  const query = {
    text: `
      UPDATE facturas SET  valor=$1 , estado=$2
      WHERE id=$3
      RETURNING *
    `,
    values: [valor, estado , id]
  }
  const { rows } = await db.query(query)
  return rows
}


const getFacturasById = async (id:number) => {
  const query = {
    text: `
      SELECT * FROM facturas
      WHERE rentasyregistro_id=$1
      ORDER BY numero_factura ASC;
    `,
    values: [id]
  }
  const { rows } = await db.query(query)
  return rows
}



export const facturasModel = {
    createFactura,
    findFacturaById,
    findFacturaByFactura,
    update_Facturas,
    getFacturasById
}