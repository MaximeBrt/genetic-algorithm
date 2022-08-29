var rocket;
var popi;
var lifespan = 400;
var lifeP;
var count = 0;
var target;
var mutationRate;
var walls = []

function setup() {
  createCanvas(400, 400);
  rocket = new Rocket()
  popi = new Population()
  lifeP = createP()
  target = createVector(width/2, 50)
  mutationRate = 0.01
  walls.push(new Wall(width/2, 100, width/4, 10))
}

function draw() {
  background(0);
  walls.forEach((wall) => {
    rect(wall.x, wall.y, wall.width, wall.height)
  })
  ellipse(target.x, target.y, 16, 16)
  popi.run()
  lifeP.html(count)
  count++
  if (count == lifespan) {
    popi = popi.createNewPop()
    count = 0
  }
}

function Population() {
  this.rockets = [];
  this.popsize = 500;

  for (var i = 0; i < this.popsize; i++) {
    this.rockets[i] = new Rocket()
  }

  this.run = function() {
    this.rockets.forEach((rocket) => {
      rocket.update()
      rocket.show()
    })
  }

  this.createNewPop = function() {
    this.evaluateRockets()
    var newPop = new Population()
    for (var i = 0; i < this.rockets.length; i++) {
      newPop.rockets[i] = this.selection()
    }
    return newPop
  }

  this.evaluateRockets = function() {
    var sum = 0;
    this.rockets.forEach((rocket) => {
      rocket.evaluate()
      sum += rocket.fitness
    })
    this.rockets.forEach((rocket) => {
      rocket.prob = rocket.fitness/ sum
    })
  }
  
  this.selection = function() {
    var parentA = this.pickOne()
    var parentB = this.pickOne(parentA)
    var newRocket = new Rocket()
    var newDna = parentA.dna.crossover(parentB.dna)
    newDna.mutate()
    newRocket.dna = newDna
    return newRocket
  }

  this.pickOne = function(parent) {
    parent = parent || undefined
    var born = 1
    var forbidden = -1
    var i = 0
    if (parent) {
      forbidden = this.rockets.indexOf(parent)
      born -= parent.prob
      if (i == forbidden) {
        i = 1
      }
    }

    var r = random(0, born)
    while(r > 0) {
      r -= this.rockets[i].prob
      if (i+1 != forbidden) {
        i += 1
      } else {
        i += 2
      }
    }
    return this.rockets[i-1]
  }
}

function DNA() {
  this.genes = [];
  for (var i = 0; i < lifespan; i++) {
    this.genes[i] = p5.Vector.random2D();
    this.genes[i].setMag(0.1);
  }

  this.crossover = function(parent) {
    var point = int(random(0, this.genes.length))
    var newGenes = []
    for (var i = 0; i < this.genes.length; i++) {
      if (i<point) {
        newGenes[i] = this.genes[i]
      }
      else {
        newGenes[i] = parent.genes[i]
      }
    }
    var newDna = new DNA()
    newDna.genes = newGenes
    return newDna
  }

  this.mutate = function() {
    this.genes.forEach((vect) => {
      var r = random(0,1)
      if (r < mutationRate) {
        vect = p5.Vector.random2D().setMag(0.1)
      }
    })
  }

}

function Rocket() {
  this.pos = createVector(width/2, height);
  this.vel = createVector();
  this.acc = createVector();
  this.dna = new DNA();
  this.fitness = 0;
  this.prob = 0;
  this.hasTouched = 0

  this.applyForce = function(force) {
    this.acc.add(force)
  }

  this.update = function() {
  
    var d = dist(this.pos.x, this.pos.y, target.x, target.y)
    var hasHitWall = false
    walls.forEach((wall) => {
      if (hasHitWall || wall.isTouching(this.pos)) {
        hasHitWall = true
      }
    })
    if (d <= 15 || hasHitWall) {
      this.acc = createVector()
      this.hasTouched = hasHitWall ? -1 : 1
    }
    else{
      this.applyForce(this.dna.genes[count])
  
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }
  }

  this.show = function() {
    push()
    noStroke()
    switch(this.hasTouched) {
      case -1:
        fill(255, 0, 0)
        break
      case 0:
        fill(255, 150)
        break
      case 1:
        fill(0, 255, 0)
        break
    }
    translate(this.pos.x, this.pos.y)
    rotate(this.vel.heading())
    rectMode(CENTER)
    rect(0, 0, 25, 5)
    pop()
  }

  this.evaluate = function() {
    var d = dist(this.pos.x, this.pos.y, target.x, target.y)
    this.fitness = 1/d
  }

}

function Wall(x, y, wallWidth, wallHeight) {
  this.x = x-wallWidth/2
  this.y = height-(y-wallHeight/2)
  this.width = wallWidth
  this.height = wallHeight

  this.isTouching = function(pos) {
    var distX = abs(this.x + this.width/2 - pos.x)
    var distY = abs(this.y + this.height/2 - pos.y)
    if (distX <= this.width/2 && distY <= this.height/2) {
      return true
    }
    return false
  }
}
