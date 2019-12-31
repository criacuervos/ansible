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

function newConnection(socket) {
  console.log('new connection: ' + socket.id);

  socket.on('mouse', mouseMessage);

  function mouseMessage(data) {
    console.log(data);

    socket.broadcast.emit('mouse', data);
  }  

}
