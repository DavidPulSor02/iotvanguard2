const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    event: { type: String, required: true },
    value: { type: String, required: true },
    uid: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', historySchema);