// services/UsuarioService.js

const sql = require('mssql');
const connection = require('../config/sqlserver');
const Roles = require('../models/Roles');



class RolesServices {  

  static async getAllRoles() {
    try {
      const conexao = new connection();
      await conexao.conectar();
      const rows = conexao.query('SELECT id, nome FROM Roles');

      return (await rows).recordsets;
    } catch (error) {
      throw new Error(`Erro ao buscar: ${error.message}`);
    }
  };

  static async getUserRolesById(id){
    try {
      const conexao = new connection();
      await conexao.conectar();

      const query = 'SELECT id_usuario, id_roles, nome FROM Usuario_Roles WHERE id_usuario = @id';

      const request = conexao.pool.request();
      request.input('id', sql.VarChar, id);
      
      const result = await request.query(query)

      return result.recordset;
    } catch (error) {
      throw new Error(`Erro ao buscar: ${error.message}`);
    }
  }

  static async getAllUsersRoles() {
    try {
      const conexao = new connection();
      await conexao.conectar();
      const rows = conexao.query('SELECT id_usuario, id_roles, nome FROM Usuario_Roles');

      return (await rows).recordsets;
    } catch (error) {
      throw new Error(`Erro ao buscar: ${error.message}`);
    }
  };

  static async salvar(nome, descricao){
    console.log(nome, descricao)
    try{
      const conexao = new connection();
      await conexao.conectar();
      const nova_role =  new Roles(nome, descricao);
      //const query = 'INSERT INTO Usuario (nome, email, senha) OUTPUT INSERTED.id Values(@nome,@email,@senha)';
      const query = 'BEGIN TRANSACTION; INSERT INTO Roles (nome, descricao) Values(@nome,@descricao); SELECT SCOPE_IDENTITY() AS id; COMMIT;';
      const request = conexao.pool.request();
      request.input('nome', sql.VarChar, nova_role.nome);
      request.input('descricao', sql.VarChar, nova_role.email);

      const result = await request.query(query);
      console.log(query)
      return result.recordset[0].id;
    }catch(error){
      throw new Error(`Erro ao salvar: ${error.message}`)
    }
  };

  static async atualizar(id, nome, descricao){
    try{
      const conexao = new connection();
      await conexao.conectar();
      const query = 'UPDATE Roles SET nome = @nome, descricao = @descricao WHERE id = @id';

      const request = conexao.pool.request();
      request.input('id', sql.Int, id);
      request.input('nome', sql.VarChar, nome);
      request.input('descricao', sql.VarChar, descricao);

      const result = await request.query(query);
      if (result.affectedRows === 0){
        throw new Error('Usuário não encontrado.');
      };
      return 'Usuário atualizado com sucesso.'
    }catch(error){
      throw new Error(`Erro no serviço ao atualizar usuário: ${error.message}`);
    }
  };

  static async deletar(id){
    try{
      const conexao = new connection();
      await conexao.conectar();
      const query = 'DELETE from Roles WHERE id = @id';

      const request = conexao.pool.request();
      request.input('id', sql.Int, id);
      const result = await request.query(query);
      
      if (result.affectedRows === 0){
        throw new Error('Permissão não encontrado.');
      };

      return result;
      
    }catch(error){
      throw new Error(`Erro ao deletar. ${error.message}`);
    }
  }

  // salvar user_roles
  static async salvarUsuarioRoles(userRoles) {
    if (!Array.isArray(userRoles) || userRoles.length === 0) {
      throw new Error('A lista userRoles está vazia ou inválida.');
    }
  
    try {
      const conexao = new connection();
      await conexao.conectar();
  
      const values = userRoles
        .map(({ id_roles, id_usuario, nome }) => `(${id_roles}, ${id_usuario}, '${nome}')`)
        .join(', ');
  
      const query = `
        BEGIN TRANSACTION;
        INSERT INTO Usuario_Roles (id_roles, id_usuario, nome) VALUES ${values};
        COMMIT;
      `;
  
      await conexao.pool.request().query(query);
      console.log('Associações salvas com sucesso.');
      return true;
    } catch (error) {
      throw new Error(`Erro ao salvar userRoles: ${error.message}`);
    }
  }
  
  static async deletarUsuarioRoles(id){
    console.log("----id delete service: " + id)
    try{
      const conexao = new connection();
      await conexao.conectar();
      const query = 'DELETE from Usuario_Roles WHERE id_usuario = @id';

      const request = conexao.pool.request();
      request.input('id', sql.Int, id);

      const result = await request.query(query);
  
      
      if (result.affectedRows === 0){
        throw new Error('Permissão não encontrado.');
      };

      return result;
      
    }catch(error){
      throw new Error(`Erro ao deletar. ${error.message}`);
    }
  }
  


}

module.exports = RolesServices;
