const DispositivoService = require('../services/DispositivoServices');

class DispositivoController {
  static async getAllDispositivo(req, res) {
    try {
      const dispos = await DispositivoService.getAllDispositivos();
      res.json(dispos);
      //console.log("--entrou na api listar:" /);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  static async salvar(req, res){
    
    const {nome, local, ip, UDPport, TCPport, protocolo, tipo, ativo, proxy, porta_proxy} = req.body;
    console.log({nome, local, ip, UDPport, TCPport, protocolo, tipo, ativo, proxy, porta_proxy});
    try{
      if (!nome || !local || !ip || !UDPport) {
        return res.status(400).json({ mensagem: 'Preencha os campos necessários.' });
      };

      const dispositivoId = await DispositivoService.salvar(nome, local, ip, UDPport, TCPport, protocolo, tipo, ativo, proxy, porta_proxy);
      res.status(201).json({message: 'Dispositivo criado com sucesso', id: dispositivoId})
    }catch(error){
      res.status(500).json({ error: error.message});
    }
  };

  static async atualizar(req, res){

    const  { id } = req.params;
    const {nome, local, ip, UDPport, TCPport, protocolo, tipo, ativo, proxy, porta_proxy } = req.body;
    //console.log(id, nome, local, ip, UDPport);
    try{
      if( !id || !nome || !local || !ip || !protocolo || !tipo){
        return res.status(400).json({ mensagem: 'Preencha os campos necessários.'})
      }

      const mensagem =  await DispositivoService.atualizar(id, nome, local, ip, UDPport, TCPport, protocolo, tipo, ativo, proxy, porta_proxy);
      res.status(200).json({ mensagem });
    } catch (error) {
      res.status(500).json({ mensagem: error.message});
    }
  };

  static async delete(req, res){
    const { id } = req.params;
    try{
        if(!id){
          return res.status(400).json({mensagem: 'O campo {id} é obrigatório.'});
        };
        const mensagem =  await DispositivoService.deletar(id);
        return res.status(200).json({ mensagem });
    }catch(erro){
      res.status(500).json({ mensagem: error.mensagem});
    }
  }

  //tabela Tipo Dispositivo
  static async getAllTipoDispositivo(req, res) {
    try {
      const tipos = await DispositivoService.getAllTipoDispositivos();
      res.json(tipos);
      //console.log("--entrou na api listar:" /);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

};

module.exports = DispositivoController;