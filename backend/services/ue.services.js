// ue.services.js

const pool = require('../database/db')

async function getAllUE(){
    const client = await pool.connect();
    try{
        const res = await client.query('SELECT * FROM UE;')
        return res.rows;
    } catch (e) {
        console.error('Impossible to fetch all ues : ' + e);
    } finally {
        client.release();
    }
}

async function countUeNumber(){
    const client = await pool.connect();
    try{
        const res = await client.query('SELECT count(*) as nb_ues FROM UE;')
        return res.rows[0];
    } catch (e) {
        console.error('Impossible to count ue number : ' + e);
    } finally {
        client.release();
    }
}

async function getResponsableUE(code){
    const client = await pool.connect();
    try{
        const res = await client.query('SELECT u.* FROM Utilisateur u INNER JOIN UE ue ON u.id_utilisateur = ue.responsable_id where code = $1;', [code]);
        return res.rows;
    } catch (e){
        console.error('Impossible to fetch responsable ue : ' + e);
    } finally {
        client.release();
    }
}

module.exports = {
    getAllUE,
    countUeNumber,
    getResponsableUE,
}