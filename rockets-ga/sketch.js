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

function mouseClicked() {
  console.log(mouseX, mouseY)
  const force = createVector(mouseX, mouseX)
  force.normalize()
  force.mult(0.1)
  rocket.applyForce(force)
}