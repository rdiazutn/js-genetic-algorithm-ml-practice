class Movable {
  constructor (x, y, angleOffset = 0) {
    this.position = createVector(x, y)
    this.velocity = createVector(0, 0)
    this.aceleration = createVector(0, 0.2)
    this.angleOffset = angleOffset
  }

  move () {
    this.velocity.add(this.aceleration)
    this.position.add(this.velocity)
    if (this.position.y > height || this.position.y < 0) {
      this.bounceY()
    }
    if (this.position.x > width || this.position.x < 0) {
      this.bounceX()
    }
  }

  applyForce (force) {
    this.aceleration.add(force)
  }

  bounceX () {
    this.velocity.x = -this.velocity.x
  }

  bounceY () {
    this.velocity.y = -this.velocity.y
  }

  freeze () {
    this.velocity.mult(0)
    this.aceleration.mult(0)
  }

  angle () {
    return Math.atan2(this.velocity.y, this.velocity.x) - this.angleOffset
  }
}