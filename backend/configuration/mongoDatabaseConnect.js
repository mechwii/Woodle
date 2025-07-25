var mongodb = require('mongodb')
var UeDAO = require('../Dao/UeDao')
var NotificationDao = require('../Dao/NotificationsDao')
var logDaos = require('../Dao/LogsDao')

async function connectToDatabase(){
    const client = new mongodb.MongoClient(process.env.MONGODB_URI);

    try{
        await client.connect();
        console.log("Connexion à MongoDB réussi");
        await UeDAO.injectDB(client)
        await NotificationDao.injectDB(client)
        await logDaos.injectDB(client)

    } catch (e){
        console.error('Impossible de se connecter à la base de donnée MongoDB ', e);
        process.exit(1);
    }
}

module.exports = {
    connectToDatabase
}