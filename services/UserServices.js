// services/UsuarioService.js

const sql = require('mssql');
const connection = require('../config/sqlserver');
const Usuario = require('../models/User');



class UserServices {  

  static async getAllUsers() {
    try {
      const conexao = new connection();
      await conexao.conectar();
      const rows = conexao.query('SELECT * FROM Usuario');

      return (await rows).recordsets;
    } catch (error) {
      throw new Error(`Erro ao buscar todos os usuários: ${error.message}`);
    }
  };

  static async getUserByEmail(email){
    try {
      const conexao = new connection();
      await conexao.conectar();

      const query = 'SELECT id, nome, email, senha FROM Usuario WHERE email = @email';

      const request = conexao.pool.request();
      request.input('email', sql.VarChar, email);
      
      const result = await request.query(query)

      return result.recordset;
    } catch (error) {
      throw new Error(`Erro ao buscar todos os usuários: ${error.message}`);
    }
  }

  static async salvar(nome, email, senha){
    console.log(nome, email, senha)
    try{
      const conexao = new connection();
      await conexao.conectar();
      const novo_user =  new Usuario(nome, email, senha);
      //const query = 'INSERT INTO Usuario (nome, email, senha) OUTPUT INSERTED.id Values(@nome,@email,@senha)';
      const query = 'BEGIN TRANSACTION; INSERT INTO Usuario (nome, email, senha) Values(@nome,@email,@senha); SELECT SCOPE_IDENTITY() AS id; COMMIT;';
      const request = conexao.pool.request();
      request.input('nome', sql.VarChar, novo_user.nome);
      request.input('email', sql.VarChar, novo_user.email);
      request.input('senha', sql.VarChar, novo_user.senha);

      const result = await request.query(query);
      console.log(query)
      return result.recordset[0].id;
    }catch(error){
      throw new Error(`Erro ao salvar: ${error.message}`)
    }
  };

  static async atualizar2(id, nome, email, senha, roles){
    try{
      const conexao = new connection();
      await conexao.conectar();
      const query = 'UPDATE Usuario SET nome = @nome, email = @email, senha = @senha WHERE id = @id';

      const request = conexao.pool.request();
      request.input('id', sql.Int, id);
      request.input('nome', sql.VarChar, nome);
      request.input('email', sql.VarChar, email);
      request.input('senha', sql.VarChar, senha);

      const result = await request.query(query);
      if (result.affectedRows === 0){
        throw new Error('Usuário não encontrado.');
      };
      return 'Usuário atualizado com sucesso.'
    }catch(error){
      throw new Error(`Erro no serviço ao atualizar usuário: ${error.message}`);
    }
  };

  static async atualizar(id, nome, email, senha, roles) {
    let conexao;
    let request;
    let queryUsuario;
    try {
      // Inicia a conexão com o banco de dados
      conexao = new connection();
      await conexao.conectar();
  
      // Iniciar transação para garantir que todas as operações ocorram de forma atômica
      request = conexao.pool.request();
      //await request.query('BEGIN TRANSACTION');
  
      // Atualizar usuário
      if(!senha){
        console.log("---senha em branco: " + senha)
        queryUsuario = 'UPDATE Usuario SET nome = @nome, email = @email WHERE id = @id;';
      }else{
        console.log("---senha cheia: " + senha)
        queryUsuario = 'UPDATE Usuario SET nome = @nome, email = @email, senha = @senha WHERE id = @id;';
      }
    
      request.input('id', sql.Int, id);
      request.input('nome', sql.VarChar, nome);
      request.input('email', sql.VarChar, email);
      request.input('senha', sql.VarChar, senha);
      const resultUsuario = await request.query(queryUsuario);
      
      if (resultUsuario.rowsAffected[0] === 0) {
        throw new Error('Usuário não encontrado.');
      }
  
      // Deletar as roles antigas na tabela Usuario_Role
      const queryDeleteRoles = 'DELETE FROM Usuario_Roles WHERE id_usuario = @id;';
      await request.query(queryDeleteRoles);

      // Inserir as novas roles associadas ao usuário em lote
      const queryInsertRoles = `
        INSERT INTO Usuario_Roles (id_usuario, id_roles, nome)
        VALUES (@id_usuario, @id_roles, @nome);
      `;
  
      // Inserir em lote as roles associadas ao usuário
      for (let i = 0; i < roles.length; i++) {
        const insertRequest = conexao.pool.request();
        insertRequest.input('id_usuario', sql.Int, id);
        insertRequest.input('id_roles', sql.Int, roles[i].id_roles);
        insertRequest.input('nome', sql.VarChar, roles[i].nome);
        await insertRequest.query(queryInsertRoles);

      }
  
      // Confirmar transação se tudo estiver certo
      //await request.query('COMMIT');
      return 'Usuário e roles atualizados com sucesso.';
    } catch (error) {
      // Se ocorrer qualquer erro, reverter transação
      //if (conexao) {
        //await request.query('ROLLBACK');
      //}
      throw new Error(`Erro ao atualizar usuário e roles: ${error.message}`);
    }
  }
  
  // deleta na tabela usuario e usuario_roles
  static async deletar(id){
    try{
      const conexao = new connection();
      await conexao.conectar();
      const query = 'DELETE from Usuario WHERE id = @id; DELETE from Usuario_Roles WHERE id_usuario = @id';

      const request = conexao.pool.request();
      request.input('id', sql.Int, id);
      const result = await request.query(query);
    23
      if (result.affectedRows === 0){
        throw new Error('Usuário não encontrado.');
      };

      return result;
      
    }catch(error){
      throw new Error(`Erro ao deletar. ${error.message}`);
    }
  }


  // Outros métodos de serviço, como criar, atualizar ou deletar usuário.
}

module.exports = UserServices;
