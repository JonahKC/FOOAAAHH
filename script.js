let obstacle;

function setup() {
	createCanvas(windowWidth, windowHeight);
	obstacle = loadImage('pictures/plane.png');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}