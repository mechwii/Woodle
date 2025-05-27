const express = require('express');
const dotenv = require('dotenv')
const userRoutes = require('./routes/user.routers')
const cors = require('cors');
dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(express.json()); // Pour spécifier qu'on va utiliser du json car de base express ne traite pas les JSON
app.use(cors());

//app.use('/users', userRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})