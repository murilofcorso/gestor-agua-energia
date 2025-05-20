const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Computador@zul18',
  database: 'nome_do_banco'
});

module.exports = pool.promise();