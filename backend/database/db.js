const {Pool} = require('pg');
require('dotenv').config();

const credentials = {
    user: process.env.PGUSER,         
    host: process.env.PGHOST,   
    database: process.env.PGDATABASE, 
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,                            
    ssl: { rejectUnauthorized: false }  
};

const pool = new Pool(credentials);

pool.on('connect', () => {
    console.log('Connected to the database');
})

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
})

module.exports = pool;

