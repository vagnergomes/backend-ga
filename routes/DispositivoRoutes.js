// routes/userRoutes.js

const express = require('express');
const router = express.Router();

const DispositivoController = require('../controllers/DispositivoController');
const login = require('../middleware/login');
const PingController = require('../controllers/PingController');

router.get('/', login.obrigatorio, DispositivoController.getAllDispositivo);
router.post('/', login.obrigatorio, DispositivoController.salvar);
router.put('/:id', login.obrigatorio, DispositivoController.atualizar);
router.delete('/:id', login.obrigatorio, DispositivoController.delete);
// Outros endpoints para outras operações CRUD

//Tipo Dispositvo
router.get('/tipo', login.obrigatorio, DispositivoController.getAllTipoDispositivo);

//Ping status
router.get('/status', login.obrigatorio, PingController.pingDispositivos)

module.exports = router;
