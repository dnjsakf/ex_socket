var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var sha256 = require('sha256');
//var md5 = require('md5');
//var salt = "!@#%@#SDF#!@%sdf223";
// 암호화
// 사용자의 비밀번호를 암호화하여
// 비밀번호가 일치하는지 여부만 판단함.
// 실제 비밀번호는 어디에도 저장되지 않음.
var pbkdf2Password = require('pbkdf2-password');
var hasher = pbkdf2Password();
/*
hasher({password:'111'}, function(err, pass, salt, hash){
  console.log(err, pass, salt, hash);
});
*/
var app = express();
var port = 3000;

app.locals.pretty = true;

/*************************************************/
/******************  INIT USE  *******************/
// body-parser
app.use(bodyParser.urlencoded({extended:false}));
// session
app.use(session({
  secret: 'asdfasdfa@#$ASDF!@#!@#',
  resave: false,
  saveUninitialized: true,
  store: new FileStore({ path: './sessions/'})
}));
// passport - default
app.use(passport.initialize());
app.use(passport.session());
/*************************************************/
/**************** INIT GROBAL VAR  ***************/
var users = [
  {
    username: 'heo',
    password: 'bcPjFh8lzZ0b+1xBoynwP12KXvKLjFykKuoCc/Yi0paBsg4nZPlvOxT58cOtHhvenT+xIW6xC43b4llNY8OGl59eEiEl4O2IHepg2eZxSc/3mrWMGScj7oR53UzSua2VouzMXW/ePcG01gItvO1gdhFXoJpoN6awqwsbHsKUPlI=',
    salt: 'CcRf7yTzOqE3Q42r1GahlBkK+oSVhYcscxbYlxIhtRm6MfcalhI4ahrWxUO49tGLi764lxevEnZ25H3f7epxPQ==',
    displayName: 'HeoDolf'
  }
]
/*************************************************/
/******************  SET ROUTE  ******************/

app.get('/main', function(req, res){
  console.log(req.user);
  var user = 'empty';
  if(req.user){
    user = req.user.displayName;
  }
  var output = `
    <h1>Main Page, ${user}</h1>
    <a href='/welcome'>go welcome</a>
  `;
  res.send(output);
});


app.get('/auth/logout',function(req, res){
  req.logout();
  req.session.save(function(){
    console.log('logouted:');
    res.redirect('/welcome');
  })
});
app.get('/welcome', function(req, res){
  //if(req.session.displayName){
  // 'session'을 done 함수의 인자 'user'로 치환
  if(req.user && req.user.displayName){
    res.send(`
      <h1>hello, ${req.user.displayName}</h1>
      <a href='/auth/logout'>logout</a>
      <a href='/main'>Main</a>
      `);
  } else {
    res.send(`
      <h1>Welcome, Home</h1>
      <h3>Plases login</h3>
      <ul>
        <li><a href='/auth/login'>Login</a></li>
        <li><a href='/auth/register'>register</a></li>
      </ul>
      `);
  }
});
app.post('/auth/register', function(req, res){
  hasher({password:req.body.password}, function(err, pwd, salt, hash){
    var user = {
      username: req.body.username,
      password: hash,
      salt: salt,
      displayName: req.body.displayName
    };
    users.push(user);
    req.login(user, function(err){
      req.session.save(function(){
        res.redirect('/welcome');
      });
    }); // 로그인이 끝나면
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

// done(null, user.id); // id: 식별자(기본키)
// 처음 로그인 할 때, session에 저장
passport.serializeUser(function(user, done){
  console.log('serializeUser :', user.username);
  return done(null, user.username);
});
// 다시 접근하면 session에 저장된 id 값으로 탐색.
passport.deserializeUser(function(user_id, done){
  console.log('deserializeUser', user_id);
  for(var i=0; i < users.length; i++){
    var user = users[i];
    if(user.username === user_id){
      return done(null, user);
    }
  }
});
// 구체적인 Strategy 작성
passport.use(new LocalStrategy(
  // done는 함수
  // done(err, 성공여부, {message; ' sdfsdf'})
  // done() => serializeUser()
  function(username, password, done){
    // 사용자 확인
    var uname = username;
    var pwd = password;
    for(var i=0; i < users.length; i++){
      var user = users[i];
      if(uname === user.username){
        return hasher({password:pwd, salt:user.salt},
        function(err, pass, salt, hash){
          if(hash === user.password){
            console.log('LocalStrategy', user);
            return done(null, user); //성공 -> serializeUser(user, done);
          } else {
            console.log('error password');
            return done(null, false);
          }
        });
      }
    }
    // return done(null, false);
    // console.log("passport.use last");
  }
));
app.post(
  '/auth/login',
  passport.authenticate(
    'local', // Strategy
    {
      successRedirect: '/welcome',
      failureRedirect: '/auth/login',
      failureFlash: false
    }
  )
);

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

app.listen(port, function(req, res){
  console.log('Connected '+port+' port!!');
});
