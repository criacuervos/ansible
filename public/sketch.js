var socket;

function setup() {
  let canvas = createCanvas(800, 600)
  background(40);
  canvas.parent('sketch-holder');
  socket = io.connect();
  socket.on('mouse', newDrawing);

}
//we need to have a reference to the sockets library in the client
function newDrawing(data){
  noStroke();
  fill(255, 0, 100);
  ellipse(data.x, data.y, 40, 40);
}

function mouseDragged() {
  noStroke();
  fill(255);
  ellipse(mouseX, mouseY, 40, 40);

  let data = {
    x: mouseX,
    y: mouseY
  }
  socket.emit('mouse', data)

}
//Above is the code to be able to send the message about the data containing current location of one clients cursor to the server, so that it can then send that out to the other client

function draw() {
}

