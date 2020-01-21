var socket;
let r, g, b;
let bgColor;
let cv;
let x, y;
let radius1, radius2;
let color1;
let starPositions = [];
let pg;

function setup() {
  socket = io.connect();
  cv = createCanvas(windowWidth, windowHeight)
  cv.position(0, 0);
  cv.style('z-index', '-1');
  color1 = color('#4e4376');
  cv.background(color1)
  r = random(255);
  g = random(255);
  b = random(255);

  noStroke()

  socket.on('mouse', newDrawing)

  socket.on('send-star-states', starData => {
    // console.log(starData)
    if(starData.length > 0 ){
      console.log("This is what a second or third client should see here")
      for (let {x, y, radius1, radius2} of starData[0]){
        // star(x, y, radius1, radius2, 5);
        starPositions.push({x, y, radius1, radius2})
      }
    } else if (starData.length === 0){
      console.log("This is first client code should go")
      for (let i = 0; i < 300; i++) {
        x = random(windowWidth),
        y = random(windowHeight),
        radius1 = random(2),
        radius2 = random(5),
        star(x, y, radius1, radius2, 5);
        starPositions.push({x, y, radius1, radius2})
      }
      socket.emit('star-states', starPositions)
    }
  })
  pg = createGraphics(windowWidth, windowHeight)
}

function draw(){ 
  if(mouseIsPressed === true ){
    mouseDragged();
  } else if (keyIsPressed && key == 'e'){
    stroke(color1)
    drawEraser();
  }
  //code underneath image will render on top, so all drawn code will render on top layer 
  image(pg, 0, 0, windowWidth, windowHeight);
  drawStars()
  makeMoon()

}

function drawStars(){
  for (let star of starPositions){
    noStroke()
    fill(random(100,255))
    this.star(star.x, star.y, star.radius1, star.radius2, 5);
  }
}

function makeMoon(){
  noStroke();
  fill(230,230,180);
  let moonX = windowWidth - 200
  let moonY = windowHeight - 600
  ellipse(moonX, moonY, 120,120);
  fill(color1);
  ellipse(moonX + 6, moonY, 110,120);
}

function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  // fill(255, 204, 0)
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function newDrawing(data){
  // drawingHistory.push(data)
  if (!data.erase){
  line(data.x, data.y, data.px, data.py)
  stroke(data.r, data.g, data.b);
  strokeWeight(3)
  } else {
  line(data.x, data.y, data.px, data.py)
  strokeWeight(20);
  stroke(color1);
  }
}

function mouseDragged() {
  line(mouseX, mouseY, pmouseX, pmouseY)
  strokeWeight(3)
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

function drawEraser(){
  strokeWeight(20);
  line(mouseX, mouseY, pmouseX, pmouseY);
  let data = {
    erase: true,
    x: mouseX,
    y: mouseY,
    px: pmouseX,
    py: pmouseY
  }
  // drawingHistory.push(data)
  socket.emit('mouse', data)
}