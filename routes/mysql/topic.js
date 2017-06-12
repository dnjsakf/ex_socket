module.exports = function(){
  var route = require('express').Router();
  var conn = require('../../config/mysql/db')();

  // delete
  route.get('/:id/delete', function(req, res){
    var id = req.params.id;
    var sql = "select id,title from topic";
    conn.query(sql, function(err, topics, fields){
      if(err){
        console.log(err);
        res.status(500).send(sql+"<br>Server Internal ERROR");
      }
      var sql = "select * from topic where id=?";
      conn.query(sql, [id], function(err, rows){
        if(err){
          console.log(err);
          res.status(500).send(sql+"<br>Server Internal ERROR");
        }
        if(rows.length === 0){
          console.log("There is no row in table.");
          res.status(500).send("Server Internal ERROR");
        } else {
          res.render('topic/delete', {topics:topics, user:req.user, selected_topic:rows[0]});
        }
      });
    });
  });
  route.post('/:id/delete', function(req,res){
    var id = req.params.id;
    var sql = "DELETE FROM topic where id = ?";
    conn.query(sql, [id], function(err, rows){
      if(err){
        console.log(err);
        res.status(500).send("Server Internal ERROR");
      }
      res.redirect("/topic");
    });
  });

  // edit
  route.get('/:id/edit', function(req, res){
    var sql = "select id,title from topic";
    conn.query(sql, function(err, topics, fields){
      if(err){
        console.log(err);
        res.status(500).send(sql+"<br>Server Internal ERROR");
      }
      var id = req.params.id;
      if(id){
        var sql = "select * from topic where id = ?";
        conn.query(sql, [id],function(err, topic, fields){
          if(err){
            console.log(err);
            res.status(500).send(sql+"<br>Server Internal ERROR");
          }
          res.render('topic/edit', {topics:topics, user:req.user, selected_topic:topic[0]});
        });
      } else {
        console.log("There is no topic ID.");
        res.status(500).send(sql+"<br>Server Internal ERROR");
      }
    });
  });
  route.post('/:id/edit', function(req, res){
    var title = req.body.title;
    var desc = req.body.description;
    var author = req.body.author;
    var id = req.params.id;
    var sql = "UPDATE topic SET title=?, description=?, author=? where id = ?";
    conn.query(sql, [title, desc, author, id], function(err, result, fields){
      if(err){
        console.log(err);
        res.status(500).send(sql+"<br>Server Internal ERROR");
      }
      res.redirect('/topic/' + id);
    });
  });

  // add
  route.get('/add', function(req, res){
    var sql = "select id,title from topic";
    conn.query(sql, function(err, topics, fields){
      if(err){
        console.log(err);
        res.status(500).send(sql+"<br>Server Internal ERROR");
      }
      res.render('topic/add', {topics:topics, user:req.user});
      });
  });
  route.post('/add',function(req,res){
    var title = req.body.title;
    var desc = req.body.description;
    var author = req.body.author;
    var sql = "INSERT INTO topic(title, description, author) "+
              "values(?, ?, ?)";
    conn.query(sql, [title, desc, author], function(err, result, fields){
        if(err){
          console.log(err);
          res.status(500).send(sql+"<br>Server Internal ERROR");
        }
        console.log(result);
        res.redirect('/topic/'+ result.insertId);
    });
  });

  route.get(['/', '/:id'], function(req, res){
    var sql = "select id,title from topic";
    conn.query(sql, function(err, topics, fields){
      if(err){
        console.log(err);
        res.status(500).send(sql+"<br>Server Internal ERROR");
      }
      var id = req.params.id;
      if(id){
        var sql = "select * from topic where id = ?";
        conn.query(sql, [id],function(err, topic, fields){
          if(err){
            console.log(err);
            res.status(500).send(sql+"<br>Server Internal ERROR");
          }
          res.render('topic/view', {topics:topics, user:req.user, selected_topic:topic[0]});
        });
      } else {
        res.render('topic/view',{topics:topics, user:req.user});
      }
    });
  });

  return route;
}
