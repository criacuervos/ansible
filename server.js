let express = require('express');
let socket = require('socket.io');
let app = express();
let server = app.listen(process.env.PORT || 3000);
app.use(express.static('public'));

console.log("my server is running!");

let io = socket(server);

const client = []
const history = []
const users = {} 
const starData = []

//Telling Express+Socket.io App To Listen To Port
io.on('connection', socket => {
  console.log(socket.id)

  client.push({id : socket.client.id})
  let getClientID = client.find(e => (e.id === socket.client.id))
  if(getClientID){
    socket.emit("chat-message", history);
    socket.emit("send-star-states", starData);
  }

  //chat listeners
  socket.on('new-user', name => {
    users[socket.client.id] = name 
    socket.broadcast.emit('user-connected', name)
  });

  socket.on('send-chat-message', (data) => {
    history.push(data)
    socket.broadcast.emit('chat-message', data)
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })

  //sketch listeners
  socket.on('mouse', mouseMessage);
  function mouseMessage(data) {
    socket.broadcast.emit('mouse', data);
  }

  socket.on('star-states', starPositions => {
    starData.push(starPositions)
  });

  // socket.on('key-pressed', cubePosition => {
  //   socket.broadcast.emit('move-sprite', cubePosition)
  // })

  // socket.on('disconnect', () => {
  //   socket.broadcast.emit('sprite-disconnect', cubesnClients[socket.id])
  //   delete cubesnClients[socket.id]
  // })

})
