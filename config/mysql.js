const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.MYSQL_DB_HOST,
    user: process.env.MYSQL_DB_USER,
    password: process.env.MYSQL_DB_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
});

//conectar ao banco de dados
connection.connect((err)=>{
    if(err){
        console.log('Erro ao conectar', err);
        return;
    }
    console.log('Conexão bem sucedida.');
});

//fechar conexão
process.on('SIGINT', () => {
    connection.end();
    process.exit();
});

module.exports = connection;

