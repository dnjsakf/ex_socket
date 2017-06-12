var app = require('./config/mysql/express')();
var passport = require('./config/mysql/passport')(app);

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

var auth = require('./routes/mysql/auth')(passport);
app.use('/auth', auth);
app.listen(3000, function(req, res){
  console.log('Connected 3000 port!!');
});
