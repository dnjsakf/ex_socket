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
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'wjddns1',
      database: 'example01'
    })
  }));

  return app;
}
