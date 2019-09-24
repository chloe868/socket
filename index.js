var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
const users = []

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
  socket.on('userconnected', data => {
    users.push(data);
    io.emit('userconnected', users)
  });
  socket.on('sent-chat-message', data => {
    socket.broadcast.emit('chat-message', { message: data.msg, name: user[socket.id] })
  })

  socket.on('user-disconnected', () => {
    socket.broadcast.emit('user-disconnected',users[socket.id])
    delete user[socket.id]
  })

  socket.on('chatmessage', function (msg) {
    io.emit('chatmessage', msg);
  })
  socket.on('new-user', function (msg) {
    console.log(msg)
    socket.emit('newuser', msg);
  })

  socket.on("typing", function (data) {
    io.emit("typing", data)
  })

});

http.listen(port, function () {
  console.log('listening on *:' + port);
});