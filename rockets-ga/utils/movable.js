const GRAVITY = 0.05
class Movable {
  frozen = false
  constructor (x, y, angleOffset = 0, velocity = createVector(0, 0), aceleration = createVector(0, 0)) {
    this.position = createVector(x, y)
    this.velocity = velocity
    this.aceleration = aceleration
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
    this.aceleration.mult(0)
  }

  applyForce (force) {
    this.aceleration.add(force)
  }

  bounceX () {
    this.velocity.x = -this.velocity.x
    this.aceleration.x = -this.aceleration.x
  }

  bounceY () {
    this.velocity.y = -this.velocity.y
  }

  freeze () {
    // console.log('freeze')
    this.frozen = true
    this.velocity.mult(0)
    this.aceleration.mult(0)
  }

  angle () {
    return Math.atan2(this.velocity.y, this.velocity.x) - this.angleOffset
  }
}