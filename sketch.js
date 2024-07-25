const USER = 0;
const FOURIER = 1;

let x = [];
let y = [];
let fourierX;
let fourierY;
let time = 0;
let path = [];
let mouseArray = [];
let state = 3;

function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

function getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}

function setup() {
  createCanvas(getWidth(), getHeight());
  state = 3;
}

function epicycles(x, y, rotation, fourier) {
  for (let i = 0; i < fourier.length; i++) {
    let prevx = x;
    let prevy = y;
    let freq = fourier[i].freq;
    let radius = fourier[i].amp;
    let phase = fourier[i].phase;
    x += radius * cos(freq * time + phase + rotation);
    y += radius * sin(freq * time + phase + rotation);

    stroke(255, 100);
    noFill();
    ellipse(prevx, prevy, radius * 2);
    stroke(255);
    line(prevx, prevy, x, y);
  }
  return createVector(x, y);
}

function draw() {
  background(0);

  if (state == USER) {

    let point = createVector(mouseX - width/2, mouseY - height/2);
    mouseArray.push(point);

    stroke(255);
    strokeWeight(3);
    noFill();

    beginShape();
    for (let v of mouseArray) {
      vertex(v.x + width/2, v.y + height/2);
    }
    endShape();

    strokeWeight(1);

  } else if (state == FOURIER) {
    let vx = epicycles(width / 2, 100, 0, fourierX);
    let vy = epicycles(100, height / 2, HALF_PI, fourierY);
    let v = createVector(vx.x, vy.y);
    path.unshift(v);
    line(vx.x, vx.y, v.x, v.y);
    line(vy.x, vy.y, v.x, v.y);
    
    strokeWeight(3);
    beginShape();
    noFill();
    for (let i = 0; i < path.length; i++) {
      vertex(path[i].x, path[i].y);
    }
    endShape();
    strokeWeight(1);

    const dt = TWO_PI / fourierY.length;
    time += dt;

    if (time > TWO_PI) {
      time = 0;
      path = [];
    }
  }

}

function mousePressed() {
  state = USER;
  mouseArray = [];
  x = [];
  y = [];
  time = 0;
  path = [];
}

function mouseReleased() {
  state = FOURIER;
  const skip = 1;
  for (let i = 0; i < mouseArray.length; i += skip) {
    x.push(mouseArray[i].x);
    y.push(mouseArray[i].y);
  }

  fourierX = dft(x);
  fourierY = dft(y);

  fourierX.sort((a, b) => b.amp - a.amp);
  fourierY.sort((a, b) => b.amp - a.amp);
}