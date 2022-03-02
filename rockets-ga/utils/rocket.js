class Rocket extends Movable{
  size = 20
  constructor(x, y) {
    super(x, y, Math.PI / 2)
    // TODO: Remove
  }

  move () {
    super.move()
    this.freezeIfOutOfBounds()
  }

  freezeIfOutOfBounds () {
    if (this.position.y > height + 10) {
      this.freeze()
    }
  }

  update () {
    this.move()
    this.display()
  }

  display () {
    push()
    translate(this.position.x, this.position.y)
    // Point towards triangle direction
    rotate(this.angle())
    const topPoint = createVector(0, this.size)
    const bottomLeftPoint = createVector(-this.size/2, 0)
    const bottomRightPoint = createVector(this.size/2, 0)
    triangle(topPoint.x, topPoint.y, bottomLeftPoint.x, bottomLeftPoint.y, bottomRightPoint.x, bottomRightPoint.y)
    pop()
  }
}
