let rocket = null
function setup() {
  createCanvas(600, 600)
  rocket = new Rocket(200, 200)
}

function draw() {
  background(220)
  rocket.move()
  rocket.display()
}