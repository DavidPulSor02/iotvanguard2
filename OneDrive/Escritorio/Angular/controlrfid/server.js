require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const circuitRoutes = require('./routes/circuitRoutes');

app.use(express.json());
app.use('/api', circuitRoutes);
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
