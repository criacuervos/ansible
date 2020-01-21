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
  cv.style('z-index', '-1')
  // cv.background(15)
  color1 = color('#24243e');
  var color2 = color('#302b63');
  setGradient(0, 0, windowWidth, windowHeight, color1, color2, "Y");
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
    drawEraser();
  }
  //code underneath image will render on top, so all drawn code will render on top layer 
  image(pg, 0, 0, windowWidth, windowHeight);
  for (let star of starPositions){
    noStroke()
    this.star(star.x, star.y, star.radius1, star.radius2, 5);
  }
  makeMoon()

}

function makeMoon(){
  noStroke();
  fill(230,230,180);
  ellipse(1200,200,120,120);
  fill(color1);
  ellipse(1210,200,110,120);
}

function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  fill(255, 204, 0)
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
  strokeWeight(bgColor);
  stroke(255,200,200);
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
  strokeWeight(60);
  stroke(10);
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

function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();
  if (axis == "Y") {  // Top to bottom gradient
    for (let i = y; i <= y+h; i++) {
      var inter = map(i, y, y+h, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x+w, i);
    }
  }  
  else if (axis == "X") {  // Left to right gradient
    for (let j = x; j <= x+w; j++) {
      var inter2 = map(j, x, x+w, 0, 1);
      var d = lerpColor(c1, c2, inter2);
      stroke(d);
      line(j, y, j, y+h);
    }
  }
}