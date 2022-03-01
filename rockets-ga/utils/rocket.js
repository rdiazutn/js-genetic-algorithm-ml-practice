class Rocket extends Movable{
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

  display () {
    push()
    const tRadius = 20
    translate(this.position.x, this.position.y)
    rotate(this.angle())
    const topPoint = createVector(0, tRadius)
    const bottomLeftPoint = createVector(-tRadius/2, 0)
    const bottomRightPoint = createVector(tRadius/2, 0)
    triangle(topPoint.x, topPoint.y, bottomLeftPoint.x, bottomLeftPoint.y, bottomRightPoint.x, bottomRightPoint.y)
    pop()
  }
}
