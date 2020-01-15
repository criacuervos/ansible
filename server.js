let express = require('express');
let socket = require('socket.io');
let app = express();
let server = app.listen(process.env.PORT || 3000);
app.use(express.static('public'));

console.log("my server is running!");

let io = socket(server);

const client = []
const history = []
const allCubes = []

const users = {} 

//Telling Express+Socket.io App To Listen To Port
io.on('connection', socket => {
  console.log(socket.id)

  client.push({id : socket.client.id})
  let getClientID = client.find(e => (e.id === socket.client.id))
  if(getClientID){
    socket.emit("chat-message", history);
    socket.emit("cube-history", allCubes);
  }

  //chat listeners
  socket.on('new-user', name => {
    users[socket.client.id] = name 
    console.log(users)
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

  socket.on('user-joined', cube => {
    allCubes.push(cube)
    socket.broadcast.emit('load-cube', cube)
  });

  // client.push({id : socket.client.id})
  // let getClientID = client.find(e => (e.id === socket.client.id))
  // if(getClientID){
  //   socket.emit("cube-history", allCubes);
  // }

})
