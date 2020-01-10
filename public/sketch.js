var socket;
let r, g, b;
let bgColor;
let cv

function setup() {
	cv = createCanvas(windowWidth / 2, windowHeight / 2)
  bgColor = 220;
  cv.background(bgColor);
  cv.parent('sketch-holder');
  socket = io.connect();
  socket.on('mouse', newDrawing);
  r = random(255);
  g = random(255);
  b = random(255);
  text('Hold the e key to erase', 20, 50);


}

//we need to have a reference to the sockets library in the client
function newDrawing(data){
  if (!data.erase){
  strokeWeight(5)
  stroke(255)
  fill(r, g, b);
  line(data.x, data.y, data.px, data.py)
  } else {
  strokeWeight(60);
  stroke(bgColor);
  line(data.x, data.y, data.px, data.py)
  }
}

function mouseDragged() {
  strokeWeight(5)
   stroke(g, r, b);
  line(mouseX, mouseY, pmouseX, pmouseY)
  let data = {
    erase: false,
    color: color,
    x: mouseX,
    y: mouseY,
    px: pmouseX,
    py: pmouseY
  }
  socket.emit('mouse', data)

}
//Above is the code to be able to send the message about the data containing current location of one clients cursor to the server, so that it can then send that out to the other client

function drawEraser(){
  strokeWeight(60);
  stroke(bgColor);
  line(mouseX, mouseY, pmouseX, pmouseY);
  let data = {
    erase: true,
    x: mouseX,
    y: mouseY,
    px: pmouseX,
    py: pmouseY
  }
  socket.emit('mouse', data)
}

function draw() {
  if(mouseIsPressed === true ){
    mouseDragged();
  } else if (keyIsPressed && key == 'e'){
    drawEraser();
  }
}



