var socket;
let r, g, b;
let bgColor;
let cv;
let x, y;
let boxSprite;
let newboxSprite;

let drawingHistory = [];

let cubePositions = [];
// var server = app.listen(process.env.PORT || 3000);
// var io = require('socket.io')(server);
// require('chat.js')(io);

function setup() {
  socket = io.connect();

  cv = createCanvas(windowWidth, windowHeight)
  cv.position(0, 0);
  cv.style('z-index', '-1')
  noStroke();
  r = random(255);
  g = random(255);
  b = random(255);

  makeCube();

  socket.on('mouse', newDrawing)
  
  socket.on('cube-history', allCubes => {
    if (allCubes){
      for(const cube in allCubes){
        newboxSprite = createSprite(allCubes[cube].cubeX, allCubes[cube].cubeY, 30, 30);
        newboxSprite.shapeColor = color(allCubes[cube].cubeR, allCubes[cube].cubeG, allCubes[cube].cubeB);
      }
    }
  })

  socket.on('move-sprite', cubePosition => {
    // drawSprites()
    console.log(cubePosition)

    newboxSprite.position.x = cubePosition.positionX
    newboxSprite.position.y = cubePosition.positionY
  });
}

function draw(){ 
  bgColor = 175;
  cv.background(bgColor);

  // if(mouseIsPressed === true ){
  //   mouseDragged();
  // } else if (keyIsPressed && key == 'e'){
  //   drawEraser();
  // }

  drawSprites();

  if(keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW) || keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW)){
    moveSprite()
  }

  for(const drawing in drawingHistory){
    line(drawingHistory[drawing].x, drawingHistory[drawing].y, drawingHistory[drawing].px, drawingHistory[drawing].py)
    stroke(drawingHistory[drawing].r, drawingHistory[drawing].g, drawingHistory[drawing].b);
    strokeWeight(5)
  }

  socket.on('load-cube', cube => {
    drawSprites()
    console.log("WERE IN THE LOAD CUBE FUNCTION")
    newboxSprite = createSprite(cube.cubeX, cube.cubeY, 30, 30);
    newboxSprite.shapeColor = color(cube.cubeR, cube.cubeG, cube.cubeB);
  });

  socket.on('sprite-disconnect', cube => {
    console.log(cube)
    // allSprites.removeSprites()
    // cube.visible = false
  })
}

//sprite functionalities 

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

function moveSprite(){
  let currentUser = boxSprite

  if(keyIsDown(LEFT_ARROW)){
    currentUser.position.x -= 3;
  }

  if(keyIsDown(RIGHT_ARROW)){
    currentUser.position.x += 3;
  }
  if(keyIsDown(UP_ARROW)){
    currentUser.position.y -= 3;
  }
  if(keyIsDown(DOWN_ARROW)){
    currentUser.position.y += 3;
  }

  let cubePosition = {
    positionX: currentUser.position.x,
    positionY: currentUser.position.y
  }
  // console.log(cubePosition)
  socket.emit('key-pressed', cubePosition)
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
  // console.log(drawingHistory)
  socket.emit('mouse', data)
}

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
  drawingHistory.push(data)
  socket.emit('mouse', data)
}

