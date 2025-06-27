const express = require('express');
const dotenv = require('dotenv')
const filesRoutes = require('./routes/files.router')

const userRoutes = require('./routes/user.routers');
const ueRoutes = require('./routes/ue.routers');
const notificationsRoutes = require('./routes/notifications.router')
const logsRoutes = require('./routes/logs.router')


const connexionToDatabase = require('./configuration/mongoDatabaseConnect');


const cors = require('cors');
dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(express.json()); 
app.use(cors());

app.use('/users', userRoutes);
app.use('/ue', ueRoutes);
app.use('/upload', filesRoutes);
app.use('/notifications',notificationsRoutes)
app.use('/logs',logsRoutes)




app.listen(PORT, () => {
    connexionToDatabase.connectToDatabase();
    console.log(`Server is running on port ${PORT}`);
})