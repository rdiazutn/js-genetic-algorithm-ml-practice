class Perceptron {
  weights = []
  constructor (amountOfInputs) {
    this.weights = new Array(amountOfInputs).fill(0).map(() => random(-1, 1))
  }

  feedFoward (inputs) {
    let sum = 0
    this.weights.forEach((weight, index) => {
      sum += weight * inputs[index]
    })
    return this.activate(sum)
  }

  activate (sum) {
    return sum > 0 ? 1 : -1
  }

  train (inputs, desiredTarget) {
    const guess = this.feedFoward(inputs)
    const error = desiredTarget - guess
    this.weights = this.weights.map((weight, index) => {
      return weight + error * inputs[index] * learningConstant
    })
  }


  draw() {
    stroke(0)
    strokeWeight(1)
    noFill()
    beginShape(LINES)
    const weights = this.weights
    const pend = -weights[0]/weights[1]
    vertex(width/2, pend*width/2)
    vertex(-width/2, pend*(-width/2))
    endShape()
  }

}

class TrainPoint {
  inputs = []
  answer = null
  correct = false

  constructor (x, y) {
    this.inputs = [x, y, 1]
    this.answer = this.getAnswer(x, y)
  }

  f(x) {
    return 2 * x + 1
  }

  getAnswer (x, y) {
    return y > this.f(x) ? 1 : -1
  }

  train (perceptron) {
    perceptron.train(this.inputs, this.answer)
  }
}


class Trainer {
  points = []
  perceptron = null
  currentPoint = 0
  constructor (amountOfInputs) {
    this.perceptron = new Perceptron(3)
    this.points = new Array(amountOfInputs).fill(0)
      .map(this.generateRandomPoint)
      .map(([x, y]) => new TrainPoint(x, y))
  }

  generateRandomPoint () {
    return [random(-width/2, width/2), random(-height/2, height/2)]
  }

  train () {
    const point = this.points[this.currentPoint]
    point.train(this.perceptron)
    this.currentPoint = (this.currentPoint + 1) % this.points.length
    for (let i = 0; i < this.points.length; i++) {
      stroke(0)
      const guess = this.perceptron.feedFoward(this.points[i].inputs)
      if (guess > 0) {
        noFill()
      } else {
        fill(0)
      }
      ellipse(this.points[i].inputs[0], this.points[i].inputs[1], 8, 8)
    }
    this.perceptron.draw()

  }

}

