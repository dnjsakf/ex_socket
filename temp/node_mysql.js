var mysql = require('mysql');
var conn = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'wjddns1',
  database : 'example01'
});
conn.connect();

var sql = 'delete from topic where id=?';
var params = [1];
conn.query(sql, params,function(err, rows, fiedls){
  if(err){
    console.log(err);
  } else{
    console.log(rows);
  }
});
conn.end();
