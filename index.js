require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// crear el servidor de express
const app = express();

// Configurar CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

//Base de datos
dbConnection();
// Rutas
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/login', require('./routes/auth.routes'));
// FzoDmWTiRagHbFWW
//mean_user

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + 3000);
});