module.exports = function(){
  var mysql = require('mysql');
  var conn = mysql.createConnection({
    host: 'us-cdbr-iron-east-03.cleardb.net',
    user: 'bb327788be8a11',
    password: 'a8a7f181',
    database: 'heroku_e892f68249858f8'
  });
  conn.connect();
  return conn;
}
