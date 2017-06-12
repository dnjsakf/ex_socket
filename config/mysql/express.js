module.exports = function(){
  var express = require('express');
  var session = require('express-session');
  var MySQLStore = require('express-mysql-session')(session);
  var bodyParser = require('body-parser');
  var pug = require('pug');

  var app = express();

  app.locals.pretty = true;

  app.set('view engine', 'pug');
  app.set('views', './views/mysql');

  app.use(express.static('public'));
  app.use(bodyParser.urlencoded({extended:false}));
  app.use(session({
    secret: 'asdfasdfa@#$ASDF!@#!@#',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
      host: 'us-cdbr-iron-east-03.cleardb.net',
      user: 'bb327788be8a11',
      password: 'a8a7f181',
      database: 'heroku_e892f68249858f8'
    })
  }));

  return app;
}
