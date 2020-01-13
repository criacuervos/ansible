let express = require('express');
let socket = require('socket.io');
let app = express();
let server = app.listen(process.env.PORT || 3000);
app.use(express.static('public'));

console.log("my server is running!");

let io = socket(server);

const allCubes = []
const client = []
const history = []

//Telling Express+Socket.io App To Listen To Port
io.on('connection', socket => {

  client.push({id : socket.client.id})
  let getClientID = client.find(e => (e.id === socket.client.id))
  if(getClientID){
    console.log(history)
    socket.emit("chat-message", history);
  }

  //chat listeners
  socket.on('new-user', name => {
    socket.broadcast.emit('user-connected', name)
  });

  // socket.on('send-chat-message', ({ name, message }) => {
  socket.on('send-chat-message', (data) => {
    history.push(data)
    // socket.broadcast.emit('chat-message', {message, name})
    socket.broadcast.emit('chat-message', data)

  });

  socket.on('disconnect', disconnectMessage);
  function disconnectMessage(){
    socket.broadcast.emit('user-disconnected')
  }

  //sketch listeners
  socket.on('mouse', mouseMessage);
  function mouseMessage(data) {
    socket.broadcast.emit('mouse', data);
  }

  socket.on('user-joined', cube => {
    allCubes.push(cube)
    socket.broadcast.emit('load-cube', cube)
  });


})
