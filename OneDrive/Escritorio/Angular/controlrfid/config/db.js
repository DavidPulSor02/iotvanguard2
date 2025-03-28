const mongoose = require('mongoose');
const Status = require('./models/statusModel');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB conectado - Base de datos: autope');

        // Verificar y crear estado inicial si no existe
        await Status.findOneAndUpdate(
            {},
            { led: false, door: 'closed' },
            { upsert: true }
        );

    } catch (error) {
        console.error('⛔ Error de conexión a MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;