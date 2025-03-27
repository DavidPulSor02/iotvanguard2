const statusModel = require('../models/statusModel');
const historyModel = require('../models/historyModel');

// ✍️ Registro de usuarios
const personas = {
    "B4 AD 13 49": {
        nombre: "David",
        rol: "Administrador",
        foto: "/fotos/david.jpg",
        ingreso: null
    },
    "12 34 56 78": {
        nombre: "Ana Torres",
        rol: "Administradora",
        foto: "/fotos/ana.jpg",
        ingreso: null
    }
};

let ultimoIngreso = null;

// 📋 Agregar evento al historial (modificada)
function logEvent(event, value, uid = null) {
    const now = new Date();
    const entry = {
        date: now.toLocaleDateString('es-CL'),
        time: now.toLocaleTimeString('es-CL'),
        event,
        value,
        uid: uid || 'Sistema'
    };
    historyModel.history.push(entry);

    // Mantener un máximo de 100 registros para no consumir mucha memoria
    if (historyModel.history.length > 100) {
        historyModel.history.shift();
    }
}

// 📥 Obtener estado actual del circuito
exports.getStatus = (req, res) => {
    res.json(statusModel.status);
};

// 🔄 Actualizar estado del circuito (LED o Puerta)
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

// 📜 Obtener historial completo (modificada)
exports.getHistory = (req, res) => {
    // Ordenar por fecha y hora (más recientes primero)
    const sortedHistory = [...historyModel.history].sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateB - dateA;
    });
    res.json(sortedHistory);
};

// 📊 Datos para gráfica por hora
exports.getActivityData = (req, res) => {
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

// 📥 POST /api/ingreso - Escaneo RFID (modificada)
exports.ingresoRFID = (req, res) => {
    const { uid } = req.body;

    if (personas[uid]) {
        const persona = personas[uid];
        persona.ingreso = new Date();
        ultimoIngreso = persona;

        logEvent('Acceso RFID', `Acceso concedido: ${persona.nombre}`, uid);
        console.log("✅ Ingreso registrado:", persona.nombre);

        res.json({
            success: true,
            nombre: persona.nombre,
            rol: persona.rol,
            foto: persona.foto
        });
    } else {
        logEvent('Acceso RFID', 'Acceso denegado: UID no registrado', uid);
        console.warn("❌ UID no registrado:", uid);
        res.status(404).json({
            error: "UID no registrado",
            uid: uid
        });
    }
};

// 👤 GET /api/ultimo-ingreso - Datos del último usuario
exports.getUltimoIngreso = (req, res) => {
    if (ultimoIngreso) {
        res.json(ultimoIngreso);
    } else {
        res.json({ nombre: "Nadie", rol: "", foto: "", ingreso: null });
    }
};

// 🆕 POST /api/registrar-actividad - Nuevo endpoint
exports.registrarActividad = (req, res) => {
    const { uid, evento, estado } = req.body;

    logEvent(evento, estado, uid);

    res.json({
        success: true,
        message: 'Actividad registrada'
    });
};

// 🆕 POST /api/agregarUsuario - Para el modo agregar usuario
exports.agregarUsuario = (req, res) => {
    const { uid, nombre, rol } = req.body;

    if (personas[uid]) {
        return res.status(400).json({
            error: "UID ya registrado",
            usuarioExistente: personas[uid]
        });
    }

    // Crear nuevo usuario (aquí deberías guardar en una base de datos real)
    personas[uid] = {
        nombre: nombre || `Usuario ${uid.substring(0, 8)}`,
        rol: rol || "Invitado",
        foto: "/fotos/default.jpg",
        ingreso: null
    };

    logEvent('Registro', `Nuevo usuario: ${personas[uid].nombre}`, uid);

    res.json({
        success: true,
        usuario: personas[uid]
    });
};