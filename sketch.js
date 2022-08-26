var rocket;
var popi;
var lifespan = 200;
var lifeP;
var count = 0;

function setup() {
  createCanvas(400, 400);
  rocket = new Rocket()
  popi = new Population()
  lifeP = createP()
}

function draw() {
  background(0);
  // rocket.update()
  // rocket.show()
  popi.run()
  lifeP.html(count)
  if (count == popi.popsize) {
    popi.stop()
  }
  else {
    count ++
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

  this.stop = function() {
    this.rockets.forEach((rocket) => {
      rocket.vel = createVector()
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
  this.dna = new DNA()

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
}