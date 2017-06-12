module.exports = function(passport, io){
  var route = require('express').Router();
  var conn = require(__dirname+'\\config/mysql/db')();
  var pbkdf2Password = require('pbkdf2-password');
  var hasher = pbkdf2Password();
  route.post('/register', function(req, res){
    hasher({password:req.body.password}, function(err, pwd, salt, hash){
      var user = {
        authId: 'local:'+req.body.username,
        username: req.body.username,
        password: hash,
        salt: salt,
        displayName: req.body.displayName
      };
      var sql = 'insert into users set ?';
      conn.query(sql, user, function(err, result){
        if(err){
          console.log(err);
          res.status(500);
        } else {
          req.login(user, function(err){
            req.session.save(function(){
              res.redirect('/auth/main/main');
            });
          });
        }
      });
    });
  });

  route.get(
    '/facebook',
    passport.authenticate(
      'facebook',
      {
        scope:'email'
      }
    )
  );
  route.get('/facebook/callback',
    passport.authenticate(
      'facebook',
      {
        successRedirect: '/auth/main/main',
        failureRedirect: '/auth/login'
      }
    )
  );
  route.post(
    '/login',
    passport.authenticate(
      'local', // Strategy
      {
        successRedirect: '/auth/main/main',
        failureRedirect: '/auth/login',
        failureFlash: false
      }
    )
  );
  route.get('/main/main', function(req,res){
    res.render('./auth/main/main', {user:req.user});
  });
  route.get('/register', function(req, res){
    var sql = "select id,title from topic";
    conn.query(sql, function(err, topics, fields){
      res.render('./auth/register', {topics:topics});
    });
  });
  route.get('/login', function(req, res){
    var sql = "select id,title from topic";
    conn.query(sql, function(err, topics, fields){
      res.render('./auth/login', {topics:topics});
    });
  });
  route.get('/logout',function(req, res){
    console.log("logout");
    req.logout();
    req.session.save(function(){
      res.redirect('/auth/login');
    })
  });
  return route;
}
