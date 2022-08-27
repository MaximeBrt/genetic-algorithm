var rocket;
var popi;
var lifespan = 200;
var lifeP;
var count = 0;
var target;

function setup() {
  createCanvas(400, 400);
  rocket = new Rocket()
  popi = new Population()
  lifeP = createP()
  target = createVector(width/2, 50)
}

function draw() {
  background(0);
  ellipse(target.x, target.y, 16, 16)
  popi.run()
  lifeP.html(count)
  count++
  if (count == lifespan) {
    popi.createNewPop()
    popi = new Population()
    count = 0
  }
}

function Population() {
  this.rockets = [];
  this.popsize = 100;

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
    var maxFit = 0;
    this.rockets.forEach((rocket) => {
      rocket.evaluate()
      if (rocket.fitness > maxFit) {
        maxFit = rocket.fitness
      }
    })
    this.rockets.forEach((rocket) => {
      rocket.fitness /= maxFit
    })
  }
  
}

function DNA() {
  this.genes = [];
  for (var i = 0; i < lifespan; i++) {
    this.genes[i] = p5.Vector.random2D();
    this.genes[i].setMag(0.1);
  }
}

function Rocket() {
  this.pos = createVector(width/2, height);
  this.vel = createVector();
  this.acc = createVector();
  this.dna = new DNA();
  this.fitness = 0;

  this.applyForce = function(force) {
    this.acc.add(force)
  }

  this.update = function() {
    this.applyForce(this.dna.genes[count])

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  this.show = function() {
    push()
    noStroke()
    fill(255, 150)
    translate(this.pos.x, this.pos.y)
    rotate(this.vel.heading())
    rectMode(CENTER)
    rect(0, 0, 25, 5)
    pop()
  }

  this.evaluate = function() {
    var d = dist(this.pos.x, this.pos.y, target.x, target.y)
    this.fitness = map(d, 0, width, width, 0)
  }
}