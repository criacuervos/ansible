var socket;
let r, g, b;
let bgColor;
let cv;
let x, y;
let button; 

var boxSprite;

function setup() {
  socket = io.connect();

	cv = createCanvas(650, 700)
  bgColor = 220;
  cv.background(bgColor);
  cv.parent('sketch-holder');

  button = createButton('click me');
  button.parent('sketch-holder')
  button.position(19, 19);
  button.mousePressed()

  r = random(255);
  g = random(255);
  b = random(255);

  text('Hold the e key to erase', 10, 60);
  makeCube();

  socket.on('mouse', newDrawing)
  //this will draw the cubes of the people currently in the room
  //how it is right now i think it will just show all of the cubes stored in the server
  //so i have to figure out a way to delete a cube once someone disconnects 
  socket.on('cube-history', allCubes => {
    // console.log(allCubes)
    // console.log('in the cube history function')
    if (allCubes){
      for(const cube in allCubes){
        console.log(allCubes[cube].cubeX)
        boxSprite = createSprite(allCubes[cube].cubeX, allCubes[cube].cubeY, 30, 30);
        boxSprite.shapeColor = color(allCubes[cube].cubeR, allCubes[cube].cubeG, allCubes[cube].cubeB);
      }
    }
  })

  socket.on('load-cube', cube => {
    console.log("WERE IN THE LOAD CUBE FUNCTION")
    // console.log(cube)
    boxSprite = createSprite(cube.cubeX, cube.cubeY, 30, 30);
    boxSprite.shapeColor = color(cube.cubeR, cube.cubeG, cube.cubeB);
  });
}

function draw(){ 
  if(mouseIsPressed === true ){
    mouseDragged();
  } else if (keyIsPressed && key == 'e'){
    drawEraser();
  }

  drawSprites();

  if(keyIsDown(LEFT_ARROW)){
    boxSprite.position.x -= 2;
  }
  if(keyIsDown(RIGHT_ARROW)){
    boxSprite.position.x += 2;
  }
  if(keyIsDown(UP_ARROW)){
    boxSprite.position.y -= 2;
  }
  if(keyIsDown(DOWN_ARROW)){
    boxSprite.position.y += 2;
  }

}

function makeCube(){
  x = random(200, 400);
  y = random(50, 200);

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