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



// Genetic algorithm
class GeneticPerceptron extends Perceptron {
  trainPoints = []
  adn = null
  fitness = 0

  constructor (dna, trainPoints) {
    super(lifetime)
    this.adn = dna || new Adn()
    this.weights = this.adn.genes
    this.trainPoints = trainPoints
  }

  setFitness () {
    const amountCorrect = this.trainPoints.reduce((prev, point) => prev + (this.feedFoward(point.inputs) === point.answer ? 1 : 0), 0)
    this.fitness = amountCorrect / this.trainPoints.length
  }
}

class GeneticAlgorithm {
  constructor (amountOfInputs) {
    this.canHaveSameParent = true
    this.populationSize = 50
    this.generation = 0
    this.lifecounter = 0
    this.population = []
    this.points = new Array(amountOfInputs).fill(0)
    .map(this.generateRandomPoint)
    .map(([x, y]) => new TrainPoint(x, y))
    for (let i = 0; i < this.populationSize ; i++) {
      const adn = new GeneticPerceptron(null, this.points)
      this.population.push(adn)
    }
    this.best = this.population[0]
  }

  run () {
    if (this.lifecounter < 1) {
      this.lifecounter ++
    } else {
      this.lifecounter = 0
      this.nextGeneration()
    }
    this.draw()
  }

  draw () {
    // this.population.forEach(element => {
    //   element.draw()
    // })
    this.best.draw()
    for (let i = 0; i < this.points.length; i++) {
      stroke(0)
      const pointValue = this.points[i].answer
      if (pointValue > 0) {
        noFill()
      } else {
        fill(0)
      }
      ellipse(this.points[i].inputs[0], this.points[i].inputs[1], 8, 8)
    }
  }

  generateRandomPoint () {
    return [random(-width/2, width/2), random(-height/2, height/2)]
  }

  // GA

  nextGeneration () {
    // Fitness
    this.population.forEach(adn => adn.setFitness())
    this.population.sort((a, b) => b.fitness - a.fitness)
    // Generate stats
    this.best = this.population[0]
    this.generation++
    this.generateStats()
    // Selection
    this.matingPool = this.selection()
    if (this.matingPool.length === 0) {
      console.log('Mating pool empty')
      throw Error('Mating pool empty')
    }
    // Crossover and mutation
    this.reproduction()
  }

  selection () {
    const matingPool = []
    this.population.forEach(adn => {
      for (let i = 0; i < (adn.fitness * adn.fitness * 10000); i++) {
        matingPool.push(adn)
      }
    })
    return matingPool
  }

  reproduction () {
    const newDnaPopulation = []
    // Reproduction
    for (let i = 0; i < this.populationSize ; i++) {
      const parentA = this.matingPool[Math.floor(Math.random() * this.matingPool.length)]
      const parentB = this.getDifferentParent(parentA)
      const child = parentA.adn.crossover(parentB.adn)
      newDnaPopulation.push(child)
    }
    // Mutation
    this.population = newDnaPopulation.map(childADN => {
      childADN.mutate()
      return new GeneticPerceptron(childADN, this.points)
    })
  }

  getDifferentParent (parent) {
    let posibleParent = null
    do {
      posibleParent = this.matingPool[Math.floor(Math.random() * this.matingPool.length)]
    } while (posibleParent === parent && !this.canHaveSameParent)
    return posibleParent
  }

  fitness () {
    return this.best?.fitness
  }

  generateStats () {
    console.log('----------------------------------------')	
    console.log('Generation: ' + this.generation)
    console.log('Fitness: ' + this.fitness())
    console.log('Average fitness: ' + this.population.reduce((prev, curr) => prev + curr.fitness, 0) / this.population.length)
    console.log('----------------------------------------')
  }
}


class Adn{
  genes = []
  constructor () {
    for (let i = 0; i < 3; i++) {
      this.genes.push(this.generateGene())
    }
  }

  crossover (partner) {
    const child = new Adn()
    for (let i = 0; i < this.genes.length; i++) {
      const random = Math.random()
      child.genes[i] = random <= 0.5 ? this.genes[i] : partner.genes[i]
    }
    return child
  }

  mutate () {
    this.genes = this.genes.map(gene => {
      const random = Math.random()
      return random <= mutationRate ? this.generateGene() : gene
    })
  }

  toString () {
    return this.genes.join('')
  }

  generateGene () {
    return random(-10, 10)
  }
}
