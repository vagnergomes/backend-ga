

const sql = require('mssql');
const connection = require('../config/sqlserver');
const Dispositivo = require('../models/Dispositivo')

class DispositivoServices{

    static async getAllDispositivos() {
        try {
          const conexao = new connection();
          await conexao.conectar();
          const rows = conexao.query('SELECT * FROM Dispositivo');
    
          return (await rows).recordsets;
        } catch (error) {
          throw new Error(`Erro ao buscar Dispositivo: ${error.message}`);
        }
      };
    
      static async salvar(nome, local, ip, UDPport, TCPport, protocolo, tipo, ativo){
        console.log(nome, local, ip, UDPport, TCPport, protocolo, tipo, ativo)
        try{
          const conexao = new connection();
          await conexao.conectar();
          const new_device =  new Dispositivo(nome, local, ip, UDPport, TCPport, protocolo, tipo, ativo);
          //const query = 'INSERT INTO Usuario (nome, email, senha) OUTPUT INSERTED.id Values(@nome,@email,@senha)';
          const query = 'BEGIN TRANSACTION; INSERT INTO Dispositivo (nome, local, ip, UDPport, TCPport, protocolo, tipo, ativo) Values(@nome,@local,@ip,@UDPport,@TCPport,@protocolo,@tipo,@ativo); SELECT SCOPE_IDENTITY() AS id; COMMIT;';
          const request = conexao.pool.request();
          request.input('nome', sql.NVarChar, new_device.nome);
          request.input('local', sql.NVarChar, new_device.local);
          request.input('ip', sql.NVarChar, new_device.ip);
          request.input('UDPport', sql.NVarChar, new_device.UDPport);
          request.input('TCPport', sql.NVarChar, new_device.TCPport);
          request.input('protocolo', sql.NVarChar, new_device.protocolo);
          request.input('tipo', sql.NVarChar, new_device.tipo);
          request.input('ativo', sql.SmallInt, new_device.ativo);
          console.log(query);
          const result = await request.query(query);
          
          return result.recordset[0].id;
        }catch(error){
          throw new Error(`Erro ao salvar: ${error.message}`)
        }
      };

      static async atualizar(id, nome, local, ip, UDPport, TCPport, protocolo, tipo, ativo){
        try{
            const conexao = new connection();
            await conexao.conectar();
            const query = "UPDATE Dispositivo SET nome = @nome, local = @local, ip = @ip, UDPport = @UDPport, TCPport = @TCPport, protocolo = @protocolo, tipo = @tipo, ativo = @ativo WHERE id = @id";

            const request = conexao.pool.request();
            request.input('id', sql.Int, id);
            request.input('nome', sql.NVarChar, nome);
            request.input('local', sql.NVarChar, local);
            request.input('ip', sql.NVarChar, ip);
            request.input('UDPport', sql.NVarChar, UDPport);
            request.input('TCPport', sql.NVarChar, TCPport);
            request.input('protocolo', sql.NVarChar, protocolo);
            request.input('tipo', sql.NVarChar, tipo);
            request.input('ativo', sql.SmallInt, ativo);

            const result = await request.query(query);

            if(result.affectedRows === 0){
              throw new Error('Usuário não enconstrado.');
            }

            return 'Dispositivo atualizado com sucesso.';

        }catch(error){
          throw new Error(`Erro no serviço ao atualizar usuário: ${error.message}`);
        }
      };

      static async deletar(id){
        try{
          const conexao = new connection();
          await conexao.conectar();
          const query = 'DELETE from dispositivo WHERE id = @id';
    
          const request = conexao.pool.request();
          request.input('id', sql.Int, id);
          const result = await request.query(query);
          
          if (result.affectedRows === 0){
            throw new Error('Dispositivo não encontrado.');
          };
    
          return result;
          
        }catch(error){
          throw new Error(`Erro ao deletar. ${error.message}`);
        }
      }

      //tabela Tipo Dispositivo
      static async getAllTipoDispositivos() {
        try {
          const conexao = new connection();
          await conexao.conectar();
          const rows = conexao.query('SELECT * FROM Tipo_Dispositivo');
    
          return (await rows).recordsets;
        } catch (error) {
          throw new Error(`Erro ao buscar Tipo Dispositivo: ${error.message}`);
        }
      };

      //tebela Comandos
      static async getComando(tipo_comando, tipo_disp, protocolo){
        try{
       
          const conexao = new connection();
          await conexao.conectar();
          const query = 'SELECT TOP 1 comando FROM Comandos WHERE tipo_dispositivo = @tipo_disp AND tipo = @tipo_comando AND protocolo = @protocolo';
          
          const request = conexao.pool.request();
          request.input('tipo_disp', sql.VarChar, tipo_disp);
          request.input('tipo_comando', sql.VarChar, tipo_comando);
          request.input('protocolo', sql.VarChar, protocolo);
          
          const result = await request.query(query);

          // Verifica se tem resultado antes de acessar .comando
          if (result.recordset.length === 0) {
            return ''; // ou null, dependendo do que você quiser retornar
          }

          //console.log("----: " + result.recordset[0].comando)
          return result.recordset[0].comando || '' ;
        }catch (error){
          throw new Error(`Erro ao buscar comando: ${error.message}`)
        }
      }


}

module.exports = DispositivoServices