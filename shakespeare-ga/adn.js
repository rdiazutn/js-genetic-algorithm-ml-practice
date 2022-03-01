class Adn{
  constructor (exactWord, mutationProbability) {
    this.genes = generateStr(exactWord.length)
    this.exactWord = exactWord
    this.mutationProbability = mutationProbability
  }

  setFitness () {
    this.fitness = this.genes.reduce((prev, curr, idx) => prev + (curr === this.exactWord[idx] ? 1 : 0), 0) / this.exactWord.length
  }

  crossover (partner) {
    const child = new Adn(this.exactWord, this.mutationProbability)
    for (let i = 0; i < this.genes.length; i++) {
      const random = Math.random()
      child.genes[i] = random <= 0.5 ? this.genes[i] : partner.genes[i]
    }
    return child
  }

  mutate () {
    this.genes = this.genes.map(gene => {
      const random = Math.random()
      return random <= this.mutationProbability ? generateStr(1)[0] : gene
    })
  }

  toString () {
    return this.genes.join('')
  }
}

function generateStr(length) {
  let result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
 }
 return result.split('');
}

module.exports = Adn