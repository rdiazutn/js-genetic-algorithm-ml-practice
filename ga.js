const Adn = require('./adn.js')
class GeneticAlgorithm {
  constructor () {
    this.setup()
  }

  setup () {
    this.exactWord = 'Rodri capo'
    this.mutationProbability = 0.01
    this.populationSize = 200
    this.maxGenerations = 1000

    this.population = []
    this.generation = 0
    this.best = null
  }

  run () {
    // Generation
    this.generateAndSetPopulation()
    for (; this.generation < this.maxGenerations ; this.generation++) {
      // Mark best
      this.best = this.population[0]
      this.generateStats()
      if (this.best.toString() === this.exactWord) {
        break
      }
      // Selection
      this.matingPool = this.selection()
      // Crossover and mutation
      this.population = this.reproduction()
      // Sort population
      this.population.forEach(adn => adn.setFitness())
      this.population.sort((a, b) => b.fitness - a.fitness)
    }
  }

  generateAndSetPopulation () {
    for (let i = 0; i < this.populationSize ; i++) {
      const adn = new Adn(this.exactWord, this.mutationProbability)
      adn.setFitness()
      this.population.push(adn)
    }
    this.population.sort((a, b) => b.fitness - a.fitness)
  }

  selection () {
    const matingPool = []
    this.population.forEach(adn => {
      for (let i = 0; i < (adn.fitness * 100); i++) {
        matingPool.push(adn)
      }
    })
    return matingPool
  }

  reproduction () {
    const newPopulation = []
    // Reproduction
    for (let i = 0; i < this.populationSize ; i++) {
      const parentA = this.matingPool[Math.floor(Math.random() * this.matingPool.length)]
      const parentB = this.matingPool[Math.floor(Math.random() * this.matingPool.length)]
      const child = parentA.crossover(parentB)
      newPopulation.push(child)
    }
    // Mutation
    this.population = newPopulation.map(child => {
      child.mutate()
      return child
    })
    return newPopulation
  }

  generateStats () {
    console.log('----------------------------------------')	
    console.log('Generation: ' + this.generation)
    console.log('Best: ' + this.best.toString())
    console.log('Fitness: ' + this.best.fitness)
    console.log('----------------------------------------')
  }
}
module.exports = GeneticAlgorithm