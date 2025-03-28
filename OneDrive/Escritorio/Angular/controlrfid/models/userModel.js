const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    rol: { type: String, required: true },
    foto: { type: String, required: true },
    ultimoIngreso: { type: Date }
});

module.exports = mongoose.model('User', userSchema);