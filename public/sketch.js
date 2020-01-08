var socket;
let r, g, b;

let bgColor;
let mode = 0;

function setup() {
  let canvas = createCanvas(800, 600)
  bgColor = 127;
  background(bgColor);
  canvas.parent('sketch-holder');
  socket = io.connect();
  socket.on('mouse', newDrawing);
  r = random(255);
  g = random(255);
  b = random(255);
}
//we need to have a reference to the sockets library in the client
function newDrawing(data){
  noStroke();
  fill(r, g, b);
  ellipse(data.x, data.y, 10, 10);
}

function mouseDragged() {
  // noStroke();
  // fill(g, r, b);
  stroke(255);
  // ellipse(mouseX, mouseY, 10, 10);
  line(mouseX, mouseY, pmouseX, pmouseY)
  let data = {
    x: mouseX,
    y: mouseY
  }
  socket.emit('mouse', data)

}
//Above is the code to be able to send the message about the data containing current location of one clients cursor to the server, so that it can then send that out to the other client

function draw() {
  if(mouseIsPressed === true ){
    mouseDragged();
  } else if (mode == 1){
    drawEraser();
  }

  if(keyIsPressed && key == 'e'){
    mode = 1;
  } else {
    mode = 0;
  }
}

function drawEraser(){
  strokeWeight(100);
  stroke(bgColor);
  line(mouseX, mouseY, pmouseX, pmouseY);
}

