var express = require('express');
var session = require('express-session');
var app = express();

app.use(session({
  secret: 'asdfasdfa@#$ASDF!@#!@#',
  resave: false,
  saveUninitialized: true
}));

app.get('/count', function(req, res){
  if(req.session.count){
    req.session.count += 1;
  } else {
    req.session.count = 1;
  }
  res.send('count : ' + req.session.count);
});
app.get('/tmp', function(req, res){
  console.log(req.session);
  res.send('result : ' + req.session.count);
});

app.listen(3000, function(req, res){
  console.log('Connected 3000 port!!');
});
