module.exports = function(){
  var mysql = require('mysql');
  var conn = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'wjddns1',
    database: 'example01'
  });
  conn.connect();
  return conn;
}
