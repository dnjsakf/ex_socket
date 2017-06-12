var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
//var md5 = require('md5');
var sha256 = require('sha256');
//var salt = "!@#%@#SDF#!@%sdf223";
// 암호화
// 사용자의 비밀번호를 암호화하여
// 비밀번호가 일치하는지 여부만 판단함.
// 실제 비밀번호는 어디에도 저장되지 않음.
var app = express();

var pbkdf2Password = require('pbkdf2-password');
var hasher = pbkdf2Password();
/*
hasher({password:'111'}, function(err, pass, salt, hash){
  console.log(err, pass, salt, hash);
});
*/

app.locals.pretty = true;

app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
  secret: 'asdfasdfa@#$ASDF!@#!@#',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));

app.get('/auth/logout',function(req, res){
  // delete seesion data
  delete req.session.displayName;
  req.session.save(function(){
    res.redirect('/welcome');
  });
});

app.get('/welcome', function(req, res){
  if(req.session.displayName){
    res.send(`
      <h1>hello, ${req.session.displayName}</h1>
      <a href='/auth/logout'>logout</a>
      `);
  } else {
    res.send(`
      <h1>Welcome</h1>
      <a href='/auth/login'>Login</a>
      `);
  }
});
var users = [
  {
    username: 'heo',
    password: 'bcPjFh8lzZ0b+1xBoynwP12KXvKLjFykKuoCc/Yi0paBsg4nZPlvOxT58cOtHhvenT+xIW6xC43b4llNY8OGl59eEiEl4O2IHepg2eZxSc/3mrWMGScj7oR53UzSua2VouzMXW/ePcG01gItvO1gdhFXoJpoN6awqwsbHsKUPlI=',
    salt: 'CcRf7yTzOqE3Q42r1GahlBkK+oSVhYcscxbYlxIhtRm6MfcalhI4ahrWxUO49tGLi764lxevEnZ25H3f7epxPQ==',
    displayName: 'HeoDolf'
  }
]
app.post('/auth/register', function(req, res){
  hasher({password:req.body.password}, function(err, pwd, salt, hash){
    var user = {
      username: req.body.username,
      password: hash,
      salt: salt,
      displayName: req.body.displayName
    };
    console.log(pwd);
    users.push(user);
    req.session.displayName = req.body.displayName;
    req.session.save(function(){
      res.redirect('/welcome');
    });
  });
});
app.get('/auth/register', function(req, res){
  var output = `
    <h1>Register</h1>
    <form action='/auth/register' method='post'>
      <p>
        <input type='text' name='username' placeholder='username'>
      </p>
      <p>
        <input type='password' name='password', placeholder='password'>
      </p>
      <p>
        <input type='text' name='displayName' placeholder='displayName'>
      </p>
      <p>
      <input type='submit'>
      </p>
    </form>
  `;
  res.send(output);
});
app.post('/auth/login', function(req, res){
  var uname = req.body.username;
  var pwd = req.body.password;
  for(var i=0; i < users.length; i++){
    var user = users[i];
    if(uname === user.username){
      return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
        if(hash === user.password){
          console.log('username : ' + user.username);
          console.log('password : ' + user.password);
          console.log('hash : ' + hash);
          req.session.displayName = user.displayName;
          req.session.save(function(){
            res.redirect('/welcome');
          });
        } else {
          res.send('Who are you? <a href="/auth/login">Login</a>');
        }
      });
    } else {
      res.send('Who are you? <a href="/auth/login">Login</a>');
    }
    // if(uname === user.username && pbkdf2Password(pwd+user.salt) === user.password){
    //   req.session.displayName = user.displayName;
    //   //res.send('Hello, ' + user.displayName + ' !!');
    //   req.session.save(function(){
    //     res.redirect('/welcome');
    //   });
    // } else {
    //   res.send('Who are you? <a href="/auth/login">Login</a>');
    // }
  }

});
app.get('/auth/login', function(req, res){
    var output = `
      <h1>Login</h1>
      <form action='/auth/login' method='post'>
        <p>
          <input type='text' name='username' placeholder='username'>
        </p>
        <p>
          <input type='password' name='password', placeholder='password'>
        </p>
        <p>
        <input type='submit'>
        </p>
      </form>
    `;
    res.send(output);
});

app.listen(3000, function(req, res){
  console.log('Connected 3000 port!!');
});
