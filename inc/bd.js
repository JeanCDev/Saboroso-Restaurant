const mysql = require('mysql2');

// conecta ao server do mysql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'saboroso',
    password: '19029696'
  });

module.exports = connection;