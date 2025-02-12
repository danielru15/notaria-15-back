import pg from 'pg'
const { Pool } = pg

const connectionString:string = 'postgresql://postgres:9715@localhost:5432/notaria15'

export const db = new Pool({
    allowExitOnIdle: true,
    connectionString
})

