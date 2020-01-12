let express = require('express');
let socket = require('socket.io');
let app = express();
let server = app.listen(process.env.PORT || 3000);
app.use(express.static('public'));

console.log("my server is running!");

let io = socket(server);

io.on('connection', socket => {
  //this is how the chat works 
  socket.on('new-user', name => {
    socket.broadcast.emit('user-connected', name)
  });

  socket.on('send-chat-message', ({ name, message }) => {
    socket.broadcast.emit('chat-message', {message, name})
  });

  socket.on('disconnect', disconnectMessage);
  function disconnectMessage(){
    socket.broadcast.emit('user-disconnected')
  }

  //this is how the sketch works
  socket.on('mouse', mouseMessage);
  function mouseMessage(data) {
    socket.broadcast.emit('mouse', data);
  }

  socket.on('user-joined', cube => {
    socket.broadcast.emit('load-cube', cube)
  });
})
