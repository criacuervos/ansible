var express = require('express');

var app = express();
var server = app.listen(process.env.PORT || 3000);

app.use(express.static('public'));

console.log("my server is running!");

var socket = require('socket.io');
//this is like an import statement, just like express. 

var io = socket(server);
//now we have access to a socket library, which will keep track of inputs and outputs
//imported the library (it now exists as a big function) with the server variable which holds (local3000) 
//io is the object that we go inside of to this thing called sockets, below 

io.sockets.on('connection', newConnection);
//sockets work on different types of events
//this sockets calls the function on, to set up a connection event

let users = {}

//i want the key of this users object to be the ID of the socket


io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name 
    socket.broadcast.emit('user-connected', name)
  })

  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  //try converting this object into a json  string then converting it back 
  //also investigate documentation for socket.broadcast 
  socket.on('mouse', mouseMessage);

  function mouseMessage(data) {
    socket.broadcast.emit('mouse', data);
  }  
})
