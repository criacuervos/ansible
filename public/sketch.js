var socket;
let r, g, b;
let bgColor;
let cv;
let x, y;
let boxSprite;

let drawingHistory = [];

function setup() {
  socket = io.connect();
  cv = createCanvas(windowWidth, windowHeight)
  cv.position(0, 0);
  cv.style('z-index', '-1')
  // bgColor = 175;
  // cv.background(bgColor);
  noStroke();
  r = random(255);
  g = random(255);
  b = random(255);

  // text('Hold the e key to erase', 10, 60);
  makeCube();

  socket.on('mouse', newDrawing)

  socket.on('cube-history', allCubes => {
    if (allCubes){
      for(const cube in allCubes){
        boxSprite = createSprite(allCubes[cube].cubeX, allCubes[cube].cubeY, 30, 30);
        boxSprite.shapeColor = color(allCubes[cube].cubeR, allCubes[cube].cubeG, allCubes[cube].cubeB);
      }
    }
  })

  socket.on('load-cube', cube => {
    console.log("WERE IN THE LOAD CUBE FUNCTION")
    boxSprite = createSprite(cube.cubeX, cube.cubeY, 30, 30);
    boxSprite.shapeColor = color(cube.cubeR, cube.cubeG, cube.cubeB);
  });
}

function draw(){ 
  bgColor = 175;
  cv.background(bgColor);

  if(mouseIsPressed === true ){
    mouseDragged();
  } else if (keyIsPressed && key == 'e'){
    drawEraser();
  }

  drawSprites();
  const currentUser = boxSprite

  if(keyIsDown(LEFT_ARROW)){
    currentUser.position.x -= 2;
    // console.log(boxSprite.position.x )
  }
  if(keyIsDown(RIGHT_ARROW)){
    currentUser.position.x += 2;
  }
  if(keyIsDown(UP_ARROW)){
    currentUser.position.y -= 2;
  }
  if(keyIsDown(DOWN_ARROW)){
    currentUser.position.y += 2;
  }

  for(const drawing in drawingHistory){
    console.log(drawingHistory[drawing].x)
    line(drawingHistory[drawing].x, drawingHistory[drawing].y, drawingHistory[drawing].px, drawingHistory[drawing].py)
    stroke(drawingHistory[drawing].r, drawingHistory[drawing].g, drawingHistory[drawing].b);
    strokeWeight(5)
  }
}

function makeCube(){
  x = random(500, windowWidth);
  y = random(50, windowHeight);

  boxSprite = createSprite(x, y, 30, 30);
  boxSprite.shapeColor = color(r, g, b);

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
  drawingHistory.push(data)

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

  drawingHistory.push(data)
  console.log(drawingHistory)

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
