let trainer

function setup() {
  createCanvas(600, 600)
  trainer = new Trainer(1000)
  frameRate(100)
}

function draw() {
  background(220)
  translate(width / 2, height / 2)
  trainer.train()
  fill(120)
}
