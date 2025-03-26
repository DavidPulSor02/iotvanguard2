const express = require('express');
const router = express.Router();
const controller = require('../controllers/circuitController');

router.get('/status', controller.getStatus);
router.post('/status', controller.updateStatus);
router.get('/historial', controller.getHistory);
router.get('/actividad', controller.getActivityData);
router.post('/ingreso', controller.ingresoRFID);
router.get('/ultimo-ingreso', controller.getUltimoIngreso);

module.exports = router;
