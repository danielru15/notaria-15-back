import pg from 'pg'
const { Pool } = pg

const connectionString:string = 'postgresql://postgres:password@localhost:5432/notaria15'

export const db = new Pool({
    allowExitOnIdle: true,
    connectionString
})

