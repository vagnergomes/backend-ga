// controllers/PingController.js
const ping = require('ping');
const DispositivoService = require('../services/DispositivoServices');


class PingController {

      //res.json(dispos);
  static async pingDispositivos(req, res) {
    try {
     const dispos =  await DispositivoService.getAllDispositivos();

      const resultados = await Promise.all(dispos[0].map(async (d) => {
        const resultado = await ping.promise.probe(d.ip, { timeout: 1 });
        return {
          nome: d.nome,
          ip: d.ip,
          alive: resultado.alive,
          time: resultado.time,
        };
      }));

      res.json(resultados);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao executar pings', detalhes: err.message });
    }
  }
}

module.exports = PingController;
