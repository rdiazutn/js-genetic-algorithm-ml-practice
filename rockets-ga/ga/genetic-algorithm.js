class Adn{
  genes = []
  constructor () {
    for (let i = 0; i < lifetime; i++) {
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
    return createVector(random(-1,1), random(-1,1)).mult(random(0, maxForce))
  }
}

class GeneticRocket extends Rocket {
  adn = null
  geneCounter = 0
  fitness = 0
  crashed = false
  constructor(dna) {
    super(startingPoint.x, startingPoint.y)
    this.adn = dna || new Adn()
  }

  live () {
    if (this.reached) {
      this.freeze()
    } else if (!this.frozen) {
      this.applyForce(this.adn.genes[this.geneCounter])
      this.geneCounter++
    }
    this.update()
  }

  crash () {
    this.crashed = true
    this.freeze()
  }

  get reached () {
    return this.distance < (destinationRadius / 1.5)
  }

  get distance () {
    return this.position.dist(destination)
  }

  setFitness () {
    const distance = this.distance
    const lifeFitness = this.geneCounter
    const crashedPenalty = this.crashed ? 0.1 : 1
    const reachedFitness = this.reached ? 20 : 1
    this.fitness = Math.pow(1 / (distance), 2) * (1 / crashedPenalty) * (1 / lifeFitness)* reachedFitness 
  }
}

class GeneticAlgorithm {
  constructor () {
    this.setup()
  }

  setup () {
    this.canHaveSameParent = true
    this.populationSize = 100
    this.generation = 0
    this.lifecounter = 0
    this.best = null
    this.population = []
    this.obstacles = []
    for (let i = 0; i < this.populationSize ; i++) {
      const adn = new GeneticRocket()
      this.population.push(adn)
    }
  }

  run () {
    if (this.lifecounter < lifetime && !this.allCrashed()) {
      this.live()
      this.lifecounter ++
    } else {
      this.lifecounter = 0
      this.nextGeneration()
    }
  }

  live () {
    this.obstacles.forEach(obstacle => obstacle.display())
    this.population.forEach(rocket => {
      rocket.live()
      const hasCrashed = this.obstacles.some(obstacle => obstacle.isColliding(rocket))
      if (hasCrashed) {
        rocket.crash()
      }
    })
  }

  // Physics
  allCrashed () {
    return this.population.every(rocket => rocket.frozen)
  }

  addObstacle (obstacle) {
    this.obstacles.push(obstacle)
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
      for (let i = 0; i < (adn.fitness * 10000); i++) {
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
      return new GeneticRocket(childADN)
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
