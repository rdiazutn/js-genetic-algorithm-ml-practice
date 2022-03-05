let trainer
let ga
function setup() {
  createCanvas(600, 600)
  // trainer = new Trainer(1000)
  ga = new GeneticAlgorithm(200)
  frameRate(10)
}

function draw() {
  background(220)
  translate(width / 2, height / 2)
  // trainer.train()
  ga.run()
  fill(120)
}
