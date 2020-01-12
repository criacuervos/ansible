var socket;
let r, g, b;
let bgColor;
let cv;
let x, y;

function setup() {
	cv = createCanvas(windowWidth / 2, windowHeight / 2)
  bgColor = 220;
  cv.background(bgColor);
  cv.parent('sketch-holder');

  r = random(255);
  g = random(255);
  b = random(255);
  text('Hold the e key to erase', 20, 50);

  socket = io.connect();
  
  makeCube();

  socket.on('mouse', newDrawing)

  socket.on('load-cube', cube => {
    console.log("WERE IN THE LOAD CUBE FUNCTION")
    console.log(cube)
    noStroke();
    fill(cube.cubeR, cube.cubeG, cube.cubeB)
    rect(cube.cubeX, cube.cubeY, 50, 50);
  });
}



function draw(){
  if(mouseIsPressed === true ){
    mouseDragged();
  } else if (keyIsPressed && key == 'e'){
    drawEraser();
  }
}

function makeCube(){
  x = random(200, 400);
  y = random(50, 200)
  let c = color(r, g, b);
  noStroke();
  fill(c)
  rect(x, y, 50, 50);

  let cube = {
    cubeX: x,
    cubeY: y,
    cubeR: r,
    cubeG: g,
    cubeB: b, 
  }

  socket.emit('user-joined', cube)
  console.log("WERE INSIDE MAKE CUBE")
}

function newDrawing(data){
  if (!data.erase){
  line(data.x, data.y, data.px, data.py)
  stroke(data.r, data.g, data.b);
  strokeWeight(5)
  } else {
  line(data.x, data.y, data.px, data.py)
  strokeWeight(60);
  stroke(bgColor);
  }
}

function mouseDragged() {
  line(mouseX, mouseY, pmouseX, pmouseY)
  strokeWeight(5)
  stroke(r, g, b);

  let data = {
    r: r,
    g: g,
    b: b,
    erase: false,
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