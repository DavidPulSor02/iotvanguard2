require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const circuitRoutes = require('./routes/circuitRoutes');

// Configuración de Express
const app = express();

// Conexión a MongoDB con configuración moderna
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB - Base de datos: autope'))
    .catch(err => {
        console.error('⛔ Error de conexión a MongoDB:', err.message);
        process.exit(1);
    });

// Middlewares
app.use(express.json());
app.use('/api', circuitRoutes);
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});