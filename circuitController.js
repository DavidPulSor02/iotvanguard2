const statusModel = require('../models/statusModel');
const historyModel = require('../models/historyModel');

// Agrega evento al historial
function logEvent(event, value) {
    const now = new Date();
    const entry = {
        date: now.toLocaleDateString('es-CL'),
        time: now.toLocaleTimeString('es-CL'),
        event,
        value
    };
    historyModel.history.push(entry);
}

exports.getStatus = (req, res) => {
    res.json(statusModel.status);
};

exports.updateStatus = (req, res) => {
    const { led, door } = req.body;
    if (led !== undefined) {
        statusModel.status.led = led;
        logEvent('LED', led ? 'Encendido' : 'Apagado');
    }
    if (door !== undefined) {
        statusModel.status.door = door;
        logEvent('Puerta', door === 'open' ? 'Abierta' : 'Cerrada');
    }
    res.json({ success: true, status: statusModel.status });
};

exports.getHistory = (req, res) => {
    res.json(historyModel.history);
};

exports.getActivityData = (req, res) => {
    // Contar eventos por hora
    const countByHour = {};

    for (const entry of historyModel.history) {
        const hour = entry.time.split(':')[0] + ':00';
        if (!countByHour[hour]) countByHour[hour] = 0;
        countByHour[hour]++;
    }

    const labels = Object.keys(countByHour).sort();
    const data = labels.map(label => countByHour[label]);

    res.json({ labels, data });
};
const personas = {
    "DE AD BE EF": {
        nombre: "Juan Pérez",
        rol: "Estudiante",
        foto: "/fotos/juan.jpg",
        ingreso: new Date()
    },
    "12 34 56 78": {
        nombre: "Ana Torres",
        rol: "Administradora",
        foto: "/fotos/ana.jpg",
        ingreso: new Date()
    }
};

let ultimoIngreso = null;

exports.ingresoRFID = (req, res) => {
    const { uid } = req.body;
    if (personas[uid]) {
        ultimoIngreso = personas[uid];
        ultimoIngreso.ingreso = new Date();
        console.log("✅ Ingreso registrado:", ultimoIngreso.nombre);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: "UID no registrado" });
    }
};

exports.getUltimoIngreso = (req, res) => {
    if (ultimoIngreso) {
        res.json(ultimoIngreso);
    } else {
        res.json({ nombre: "Nadie", rol: "", foto: "", ingreso: null });
    }
};

