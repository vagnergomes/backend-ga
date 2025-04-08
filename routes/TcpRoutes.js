const express = require('express');
const router = express.Router();
const login = require('../middleware/login');

const TcpController = require('../controllers/TcpController');

router.post('/envia', login.obrigatorio, TcpController.envia);

// Outros endpoints para outras operações CRUD



module.exports = router;