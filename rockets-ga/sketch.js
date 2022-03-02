let ga
function setup() {
  createCanvas(600, 600)
  startingPoint = createVector(300, 550)
  destination = createVector(200, 50)
  frameRate(100)
  ga = new GeneticAlgorithm()
  ga.addObstacle(new Obstacle(createVector(300, 400), createVector(300, 20)))
  ga.addObstacle(new Obstacle(createVector(300, 100), createVector(300, 20)))
  ga.addObstacle(new Obstacle(createVector(0, 250), createVector(300, 20)))
}

function draw() {
  background(220)
  circle(destination.x, destination.y, destinationRadius)
  fill(120)
  ga.run()
}
