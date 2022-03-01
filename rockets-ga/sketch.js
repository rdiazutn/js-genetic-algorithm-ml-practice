let ga
function setup() {
  createCanvas(600, 600)
  startingPoint = createVector(300, 550)
  destination = createVector(100, height / 6)
  frameRate(120)
  ga = new GeneticAlgorithm()
}

function draw() {
  background(220)
  circle(destination.x, destination.y, destinationRadius)
  fill(120)
  ga.run()
}
