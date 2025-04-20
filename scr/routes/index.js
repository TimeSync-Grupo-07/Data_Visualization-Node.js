const express = require('express');
const router = express.Router();
const graficoController = require('../controllers/graficoController');

router.get('/grafico', graficoController.getDadosGrafico);

module.exports = router;
