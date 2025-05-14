const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'seu_usuario',
  password: 'sua_senha',
  database: 'nome_do_banco'
});

module.exports = pool.promise();