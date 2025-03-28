const User = require('../models/userModel');
const History = require('../models/historyModel');
const Status = require('../models/statusModel');

// 📋 Agregar evento al historial (ahora con MongoDB)
async function logEvent(event, value, uid = 'Sistema') {
    const now = new Date();
    const entry = {
        date: now.toLocaleDateString('es-CL'),
        time: now.toLocaleTimeString('es-CL'),
        event,
        value,
        uid
    };

    try {
        const newHistory = new History(entry);
        await newHistory.save();
    } catch (error) {
        console.error('Error al guardar en historial:', error);
    }
}

// 📥 Obtener estado actual del circuito
exports.getStatus = async (req, res) => {
    try {
        const status = await Status.findOne() || new Status();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener estado' });
    }
};

// 🔄 Actualizar estado del circuito (LED o Puerta)
exports.updateStatus = async (req, res) => {
    const { led, door } = req.body;

    try {
        const status = await Status.findOneAndUpdate(
            {},
            { $set: { led, door } },
            { upsert: true, new: true }
        );

        if (led !== undefined) {
            await logEvent('LED', led ? 'Encendido' : 'Apagado');
        }
        if (door !== undefined) {
            await logEvent('Puerta', door === 'open' ? 'Abierta' : 'Cerrada');
        }

        res.json({ success: true, status });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar estado' });
    }
};

// 📜 Obtener historial completo
exports.getHistory = async (req, res) => {
    try {
        const history = await History.find()
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        res.json(history.map(item => ({
            date: item.date,
            time: item.time,
            event: item.event,
            value: item.value,
            uid: item.uid
        })));
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener historial' });
    }
};

// 📊 Datos para gráfica por hora
exports.getActivityData = async (req, res) => {
    try {
        const activities = await History.aggregate([
            {
                $group: {
                    _id: { $substr: ["$time", 0, 2] },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        const labels = activities.map(a => `${a._id}:00`);
        const data = activities.map(a => a.count);

        res.json({ labels, data });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener datos de actividad' });
    }
};

// 📥 POST /api/ingreso - Escaneo RFID
exports.ingresoRFID = async (req, res) => {
    const { uid } = req.body;

    try {
        const usuario = await User.findOne({ uid });

        if (usuario) {
            usuario.ultimoIngreso = new Date();
            await usuario.save();

            await logEvent('Acceso RFID', `Acceso concedido: ${usuario.nombre}`, uid);
            console.log("✅ Ingreso registrado:", usuario.nombre);

            res.json({
                success: true,
                nombre: usuario.nombre,
                rol: usuario.rol,
                foto: usuario.foto
            });
        } else {
            await logEvent('Acceso RFID', 'Acceso denegado: UID no registrado', uid);
            console.warn("❌ UID no registrado:", uid);

            res.status(404).json({
                error: "UID no registrado",
                uid: uid
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar ingreso RFID' });
    }
};

// 👤 GET /api/ultimo-ingreso - Datos del último usuario
exports.getUltimoIngreso = async (req, res) => {
    try {
        const usuario = await User.findOne()
            .sort({ ultimoIngreso: -1 })
            .limit(1);

        if (usuario) {
            res.json({
                nombre: usuario.nombre,
                rol: usuario.rol,
                foto: usuario.foto,
                ingreso: usuario.ultimoIngreso
            });
        } else {
            res.json({ nombre: "Nadie", rol: "", foto: "", ingreso: null });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener último ingreso' });
    }
};

// 🆕 POST /api/registrar-actividad
exports.registrarActividad = async (req, res) => {
    const { uid, evento, estado } = req.body;

    try {
        await logEvent(evento, estado, uid);
        res.json({ success: true, message: 'Actividad registrada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar actividad' });
    }
};

// 🆕 POST /api/agregarUsuario
exports.agregarUsuario = async (req, res) => {
    const { uid, nombre, rol } = req.body;

    try {
        const usuarioExistente = await User.findOne({ uid });
        if (usuarioExistente) {
            return res.status(400).json({
                error: "UID ya registrado",
                usuarioExistente
            });
        }

        const nuevoUsuario = new User({
            uid,
            nombre: nombre || `Usuario ${uid.substring(0, 8)}`,
            rol: rol || "Invitado",
            foto: "/fotos/default.jpg"
        });

        await nuevoUsuario.save();
        await logEvent('Registro', `Nuevo usuario: ${nuevoUsuario.nombre}`, uid);

        res.json({
            success: true,
            usuario: nuevoUsuario
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar usuario' });
    }
};

// 🆕 GET /api/usuarios (Opcional - para listar usuarios)
exports.getUsuarios = async (req, res) => {
    try {
        const usuarios = await User.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};