let express = require('express');

let app = express();
let server = app.listen(process.env.PORT || 3000);

app.use(express.static('public'));

console.log("my server is running!");

let socket = require('socket.io');
//this is like an import statement, just like express. 

let io = socket(server);


io.on('connection', socket => {
  // socket.on('new-user', name => {
  //   socket.broadcast.emit('user-connected', name)
  // });

  socket.on('send-chat-message', ({ name, message }) => {
    socket.broadcast.emit('chat-message', {message, name})
  });

  //this is how the sketch works
  socket.on('mouse', mouseMessage);
  function mouseMessage(data) {
    socket.broadcast.emit('mouse', data);
  }
})
