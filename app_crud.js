var express = require('express');
var pug = require('pug');
var bodyParser = require('body-parser');
var app = require('./config/mysql/express')();
var passport = require('./config/mysql/passport')(app);

global.members = [];

var server = require('http').createServer(app);
var io = require('./server.js')(server);
var auth = require('./routes/mysql/auth')(passport, io);
app.use('/auth', auth);

/*
var topic = require('./routes/mysql/topic')();
app.use('/topic', topic);
*/
server.listen(process.env.PORT || 8080, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
// server.listen('3000', function(req, res){
//   console.log('Server connected : 3000 port');
// });
