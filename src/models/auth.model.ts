import { db } from "../config/conection.database";
import { Users } from "../interfaces/users.interface";

// crea un usuario
const createUser = async ({ name, last_name, email, password, cargo, rol }: Users) => {
    const query = {
      text: `
        INSERT INTO users (name, last_name, email, password, cargo, rol) 
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `,
      values: [name, last_name, email, password, cargo, rol],
    };
  
    const {rows} = await db.query(query)
    return rows[0]
  };

  // busca usuario por email
  const findOneByEmail = async (email?:string):Promise<Users> => {
    const query = {
        text: `
          SELECT name, last_name, email, cargo, rol, password , created_at FROM users
          WHERE EMAIL = $1
        `,
        values: [email]
    }
    const { rows } = await db.query(query)
    return rows[0]
}

 // busca usuario por id
 const findOneById = async (id:number):Promise<Users> => {
  const query = {
      text: `
        SELECT name , last_name, email  FROM users
        WHERE id = $1
      `,
      values: [id]
  }
  const { rows } = await db.query(query)
  return rows[0]
}

//trae todos los usuarios
const getAllUsers = async ():Promise<Users[]> => {
  const query = {
    text: `
      SELECT * FROM users
    `,
}
const { rows } = await db.query(query)
return rows
}


// elimina un usuario
const delete_User = async (id:number):Promise<Users[]> => {
  const query = {
    text: `
      DELETE FROM users WHERE id = $1
    `,
    values: [id]
  }
  const { rows } = await db.query(query)
return rows
}

// actualizar un usuario
const update_parcial_info = async ( cargo:string, rol:string, id:number):Promise<Users[]> => {
  const query = {
    text: `
      UPDATE users SET cargo=$1, rol=$2 
      WHERE id=$3
    `,
    values: [cargo, rol, id]
  }
  const { rows } = await db.query(query)
return rows
}

export const authModel = {
    createUser,
    findOneByEmail,
    getAllUsers,
    delete_User,
    update_parcial_info,
    findOneById
}