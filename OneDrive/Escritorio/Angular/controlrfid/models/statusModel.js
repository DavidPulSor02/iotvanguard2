const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    led: { type: Boolean, default: false },
    door: { type: String, enum: ['open', 'closed'], default: 'closed' }
}, { collection: 'status' });

module.exports = mongoose.model('Status', statusSchema);