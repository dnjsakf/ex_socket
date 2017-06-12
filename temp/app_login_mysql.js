var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var app = express();
app.locals.pretty = true;

app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
  secret: 'asdfasdfa@#$ASDF!@#!@#',
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'wjddns1',
    database: 'example01'
  })
}));

app.get('/auth/logout',function(req, res){
  // delete seesion data
  delete req.session.displayName;
  // DataStore에 저장이 끝난 후에 Callbock
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

app.post('/auth/login', function(req, res){
  // test-data
  var user = {
    username: 'heo',
    password: '111',
    displayName: 'HeoDolf'
  }
  var uname = req.body.username;
  var pwd = req.body.password;
  if(uname === user.username && pwd === user.password){
    req.session.displayName = user.displayName;
    //res.send('Hello, ' + user.displayName + ' !!');
    req.session.save(function(){
      res.redirect('/welcome');
    });
  } else {
    res.send('Who are you? <a href="/auth/login">Login</a>');
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
