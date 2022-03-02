class Obstacle {
  location = null
  dimensions = null
  constructor(location, dimensions) {
    this.location = location
    this.dimensions = dimensions
  }

  display() {
    push()
    translate(this.location.x, this.location.y)
    rect(0, 0, this.dimensions.x, this.dimensions.y)
    fill(120)
    pop()
  }

  isColliding(rocket) {
    const obstacleLeft = this.location.x
    const obstacleRight = this.location.x + this.dimensions.x
    const obstacleTop = this.location.y
    const obstacleBottom = this.location.y + this.dimensions.y
    const rocketLeft = rocket.position.x
    const rocketRight = rocket.position.x + rocket.size
    const rocketTop = rocket.position.y
    const rocketBottom = rocket.position.y + rocket.size
    return (rocketLeft < obstacleRight &&
            rocketRight > obstacleLeft &&
            rocketTop < obstacleBottom &&
            rocketBottom > obstacleTop)
  }
}