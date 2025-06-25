var mongodb = require('mongodb')
var UeDAO = require('../Dao/UeDao')

async function connectToDatabase(){
    const client = new mongodb.MongoClient(process.env.MONGODB_URI);

    try{
        await client.connect();
        console.log("Connexion à MongoDB réussi");
        await UeDAO.injectDB(client)
    } catch (e){
        console.error('Impossible de se connecter à la base de donnée MongoDB ', e);
        process.exit(1);
    }
}

module.exports = {
    connectToDatabase
}