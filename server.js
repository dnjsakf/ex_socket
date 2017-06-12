module.exports = function(server){
  var io = require('socket.io')(server);
  io.on('connection', function(socket){
    console.log('Socket Connection');
    // 접속한 클아이언트의 정보가 수신될 때
    socket.on('login', function(data){
      console.log('Client logged-in:\n name:' + data.name + '\n userid: ' + data.userid);

      // socket에 클라아이언트 정보 저장
      var name = socket.name = (data.name).replace(/ /g, '');
      var userId = socket.userid = data.userid;
      //var room = socket.room = data.room;
      if(global.members.indexOf(name) < 0){
        global.members.push(name);
      }
      console.log(global.members);

      // 접속된 모든 클라이언트에게 메시지 전송
      io.emit('other_logined', {name:socket.name, userId:socket.userid, users:global.members});
    });

    // 클라이언트로부터 메시지가 수신될 때
    socket.on('chat', function(data){
      console.log('Message from %s: %s', socket.name, data.msg);
      var msg = {
        from: {
          name: socket.name,
          userid: socket.userid
        },
        msg: data.msg
      };
      //socket.broadcast.emit('chat', msg);
      io.emit('chat', msg);
    });
    socket.on('forceDisconnect', function(){
      socket.disconnect();
    });
    socket.on('disconnect', function(){
      global.members.splice((global.members).indexOf(socket.name), 1);
      console.log('user disconnect :', socket.name, global.members);
      io.emit('disconnect', socket.name);
    });
    // namesapce /chat에 접속
    /*
    var chat = io.of('chat').on('connection',function(socket){
      console.log('Connection:chat');
      socket.on('chat message', function(data){
        console.log('chat message', data);
        var name = socket.name = data.name;
        var room = socket.name = data.room;
        // room에 join
        socket.join(room);
        // room에 join되어있는 클라이언트에게 메시지를 전송한다.
        chat.to(room).emit('chat message', data);
      });
    });
    */
  });
  return io;
}
