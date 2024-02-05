async function connect() {
    if (global.connection)
        return global.connection.connect();
 
    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: process.env.CONNECTION_STRING
    });
 
    //apenas testando a conexão
    const client = await pool.connect();
    console.log("Criou pool de conexões no PostgreSQL!");
 
    const res = await client.query('SELECT NOW()');
    console.log(res.rows[0]);
    client.release();
 
    //guardando para usar sempre o mesmo
    global.connection = pool;
    return pool.connect();
}
 
connect();


async function selectMessages(id) {
    const client = await connect();
    //const res = await client.query('SELECT * FROM clientes WHERE ID=$1', [id]);
    const res = await client.query('SELECT id, texto, "createdAt", "updatedAt" FROM public.conversas');
    return res.rows;
}

async function insertMessages(msg) {
    const client = await connect();
    //const res = await client.query('SELECT * FROM clientes WHERE ID=$1', [id]);
    const res = await client.query('insert into public.conversas (texto,"createdAt","updatedAt") values ($1,CURRENT_DATE, CURRENT_DATE)',[msg]);
    return res.rows;
}
 
module.exports = { selectMessages, insertMessages }
