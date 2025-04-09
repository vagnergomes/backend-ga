// routes/userRoutes.js

const express = require('express');
const router = express.Router();

const DispositivoController = require('../controllers/DispositivoController');
const login = require('../middleware/login');
const PingController = require('../controllers/PingController');
const tcpController = require('../controllers/TcpController');
const udpController = require('../controllers/UdpController');

router.get('/', login.obrigatorio, DispositivoController.getAllDispositivo);
router.post('/', login.obrigatorio, DispositivoController.salvar);
router.put('/:id', login.obrigatorio, DispositivoController.atualizar);
router.delete('/:id', login.obrigatorio, DispositivoController.delete);
// Outros endpoints para outras operações CRUD

//Tipo Dispositvo
router.get('/tipo', login.obrigatorio, DispositivoController.getAllTipoDispositivo);

//Ping status
router.get('/status', login.obrigatorio, PingController.pingDispositivos)

router.post('/envia', async (req, res) => {
    const { tipo_solicitacao, nome, local, ip, porta_udp, porta_tcp, protocolo, tipo } = req.body;
  
    if (!protocolo || !ip || !porta_udp || !porta_tcp || !tipo_solicitacao) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }
  
    try {
        if (tipo_solicitacao.toUpperCase() === 'SOLICITA'){
            if (protocolo.toUpperCase() === 'TCP') {
                 //await tcpController.envia(req,res);
                 return res.status(200).json({ message: tipo, nome: nome, local: local, ip: ip, porta_udp: porta_udp, porta_tcp: porta_tcp, protocolo: protocolo, tipo: tipo });
              } else if (protocolo.toUpperCase() === 'UDP') {
                await udpController.envia(req,res);
              } else {
                return res.status(400).json({ error: 'Protocolo inválido.' });
              }
        }else if (tipo_solicitacao.toUpperCase() === 'ENVIA') {
            if (protocolo.toUpperCase() === 'TCP') {
                await tcpController.envia(req,res);
              } else if (protocolo.toUpperCase() === 'UDP') {
                await udpController.envia(req,res);
              } else {
                return res.status(400).json({ error: 'Protocolo inválido.' });
              }
      } else {
        return res.status(400).json({ error: 'Solicitação inválida.' });
      }
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      return res.status(500).json({ error: 'Erro ao processar a requisição', details: error.message });
    }
  });


module.exports = router;
