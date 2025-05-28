const {Pool} = require('pg');
require('dotenv').config();

const credentials = {
    user: process.env.DB_POSTGRES_USERNAME,
    host: process.env.DB_POSTGRES_HOST,
    database: process.env.DB_POSTGRES_DATABASE,
    password: process.env.DB_POSTGRES_PASSWORD,
    port: process.env.DB_POSTGRES_PORT
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

