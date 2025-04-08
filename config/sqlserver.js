const sql = require('mssql');

// Configurações de conexão com o SQL Server
const config = {
  user: process.env.SQLSERVER_DB_USER,
  password: process.env.SQLSERVER_DB_PASSWORD,
  server: process.env.SQLSERVER_DB_HOST,
  database: process.env.SQLSERVER_DB_NAME,
  options: {
    encrypt: false // Se você estiver usando conexão com o Azure, deixe true. Caso contrário, defina como false.
  }
};

class sqlserver {
  constructor() {
    this.config = config;
    this.pool = null
  }

  async conectar() {
    try {
      this.pool = await sql.connect(this.config);
    } catch (error) {
      throw error;
    }
  }

  async fecharConexao() {
    try {
        if(this.pool){
        await sql.close();
        }
    } catch (error) {
        throw error;
    }
  }

  async query(sqlQuery) {
    try {
      const result = await this.pool.request().query(sqlQuery);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = sqlserver;
