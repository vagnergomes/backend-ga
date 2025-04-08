const RolesService = require('../services/RolesServices');

class RolesController {
  static async getAllRoles(req, res) {
    try {
      const roles = await RolesService.getAllRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static async getRolesUserById(req, res) {
    try{
      const { id } = req.params;
      const roles = await RolesService.getUserRolesById(id);
      res.json(roles);
    } catch (erro) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllUsersRoles(req, res) {
    try {
      const users_roles = await RolesService.getAllUsersRoles();
      res.json(users_roles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  static async salvar(req, res){
    
    const {nome, descricao} = req.body;
    console.log({nome, descricao});
    try{
      if (!nome || !descricao) {
        return res.status(400).json({ mensagem: 'Os campos (nome, descricao) são obrigatórios.' });
      };

      const roleId = await RolesService.salvar(nome, descricao);
      res.status(201).json({message: 'Role criado com sucesso', id: roleId})
    }catch(error){
      res.status(500).json({ error: error.message});
    }
  };

  static async atualizar(req, res){

    const  { id } = req.params;
    const {nome, descricao } = req.body;
    //console.log(id, nome, local, ip, UDPport);
    try{
      if( !id || !nome || !descricao){
        return res.status(400).json({ mensagem: 'Os campos (nome, descricao) são obrigatórios.'})
      }

      const mensagem =  await DispositivoService.atualizar(id, nome, descricao);
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
        const mensagem =  await RolesService.deletar(id);
        return res.status(200).json({ mensagem });
    }catch(erro){
      res.status(500).json({ mensagem: error.mensagem});
    }
  }


  //salvar users_roles (funcao independente do objeto usuario)
  static async salvarUsuarioRoles(req, res) {
    const { userRoles } = req.body;
    // Validação básica
    if (!userRoles || !Array.isArray(userRoles) || userRoles.length === 0) {
      return res.status(400).json({ mensagem: 'O campo userRoles deve ser uma lista não vazia.' });
    }
  
    try {
      // Chama o serviço para salvar os dados
      await RolesService.salvarUsuarioRoles(userRoles);
  
      // Retorna sucesso
      res.status(201).json({ mensagem: 'Associações de usuário e roles criadas com sucesso.' });
    } catch (error) {
      console.error('Erro ao salvar userRoles:', error.message);
  
      // Retorna erro no caso de falha
      res.status(500).json({ mensagem: 'Erro ao salvar userRoles.', detalhes: error.message });
    }
  }
  
  // funcao independente do objeto usuario
  static async deleteUsuarioRoles(req, res){
    const  { id }  = req.params;
    try{
        if(!id){
          return res.status(400).json({mensagem: 'O campo {id} é obrigatório.'});
        };
        const mensagem =  await RolesService.deletarUsuarioRoles(id);
        return res.status(200).json({ mensagem });
    }catch(erro){
      res.status(500).json({ mensagem: error.mensagem});
    }
  }

};

module.exports = RolesController;