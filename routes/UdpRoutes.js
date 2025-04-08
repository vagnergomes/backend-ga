const express = require('express');
const router = express.Router();
const login = require('../middleware/login')

const UdpController = require('../controllers/UdpController');

router.post('/envia', login.obrigatorio, UdpController.envia);

// Outros endpoints para outras operações CRUD



module.exports = router;