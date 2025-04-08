const UserService = require('../services/UserServices');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const RolesServices = require('../services/RolesServices');


class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  //salava apenas na tabela usuario //roles são adicionadas após a inserção do usuário
  static async salvar(req, res){
    
    const {nome, email, senha, roles} = req.body;
    try{
      if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos (nome, email, senha) são obrigatórios' });
      };

        bcrypt.hash(senha, 10, (errBcrypt, hash) => {
          if(errBcrypt) {
            return res.status(500).send( { error: errBcrypt })
          }
          const userId = UserService.salvar(nome, email, hash);
          res.status(201).json({message: 'Usuário criado com sucesso', id: userId})
        })
    }catch(error){
      res.status(500).json({ error: error.message});
    }
  };

  //atualiza na tabela usuario e usuario_roles
  static async atualizar(req, res) {
    const { id } = req.params;
    const { nome, email, senha, roles } = req.body;
    
    try {
      if (!nome || !email){
        return res.status(400).json({ mensagem: 'Verifique todos os campos.' });
      };

      bcrypt.hash(senha, 10, (errBcrypt, hash) => {
        if(errBcrypt) {
          return res.status(500).send( { error: errBcrypt })
        }
        if(!senha){
            hash = null;
        }
        const mensagem =  UserService.atualizar(id, nome, email, hash, roles);
        res.status(200).json({ mensagem });
      })
    } catch (error) {
      res.status(500).json({ mensagem: error.message });
    }
  };

  //deleta na tabela usuario e usuario_roles
  static async delete(req, res){
    const {id} = req.params;
    try{
        if(!id){
          return res.status(400).json({mensagem: 'Algum campo não foi encontrado.'});
        };
        const mensagem =  await UserService.deletar(id);
        return res.status(200).json({ mensagem });
    }catch(erro){
      res.status(500).json({ mensagem: error.mensagem});
    }
  }

  //login
  static async login(req, res){
    const {email, senha} = req.body;

      const results = await UserService.getUserByEmail(email)

      if(results.length < 1){
          return res.status(401).send({ mensagem: 'Usuário não cadastrado.'})
      }

      bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
          if(err){
              return res.status(401).send({ mensagem: 'Falha na autenticação.'})
          }
          if(result){
              const token = jwt.sign({
                 id_usuario: results[0].id,
                 email: results[0].email
              }, process.env.JWT_KEY,
              {
                  expiresIn: process.env.JWT_EXPIRATION
              })
              return res.status(200).send({mensagem: 'Autenticado com sucesso.', token: token})
          }
          return res.status(401).send({ mensagem: 'Falha na autenticação.'})
      })

  }

//atualizar token de login
static async refreshToken(req, res){
    const { refreshToken } = req.body;
  
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token não fornecido' });
    }
  
    // Verificar se o refresh token é válido
    jwt.verify(refreshToken, process.env.JWT_KEY, { ignoreExpiration: true }, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Refresh token inválido ou expirado' });
      }

      // Encontrar o usuário associado ao refresh token
      const user = await UserService.getUserByEmail(decoded.email) 
  
      if (!user) {
        return res.status(403).json({ message: 'Refresh token não corresponde ao usuário' });
      }
  
      const refreshToken = jwt.sign({
         id: user[0].id, 
         email: user[0].email 
        }, process.env.JWT_KEY, 
        {
          expiresIn: process.env.JWT_EXPIRATION,
        });
  
      // Gerar um novo access token
      const newAccessToken = refreshToken;

      return res.status(200).send({mensagem: 'Autenticado com sucesso.', token: newAccessToken})
      //res.json({ accessToken: newAccessToken });
    });
}


}

module.exports = UserController;
