let song
var img
var fft
var particles = []


function preload(){
  soundFormats('mp3', 'ogg');
  song = loadSound('TWICETalkthatTalk.mp3')
  img = loadImage('twice.jpg')
}

function setup() {
  // put setup code here
  createCanvas(windowWidth, windowHeight)
  angleMode(DEGREES)
  fft = new p5.FFT()
}

function draw() {
  // put drawing code here
  background(0)
  stroke(255)
  strokeWeight(3)
  noFill()

  translate(width / 2, height / 2)

  fft.analyze()
  amp = fft.getEnergy(20, 350)

  var wave = fft.waveform()

/*
//line mode
beginShape()
for (var i=windowWidth/5; i<windowWidth/5*4; i++){
  var index = floor(map(i, width/5, width/5*4, 0, wave.length))
  var x = i
  var y = wave[index] * 3000 + height/2
  vertex(x,y)
}
endShape()
*/


//circle mode
for (var j=-1; j<=1; j+=2){
  beginShape()
  for (var i=0; i<=180; i+=1){
    var index = floor(map(i, 0, 180, 0, wave.length-1)) //why minus 1
    var r = map(wave[index], -1, 1, 150, 350)
    //var r = wave[index]
  
    var x = r * j * sin(i)
    var y = r * j * cos(i)
    vertex(x, y)
  }
  endShape()
}
  var p = new Particle()
  particles.push(p)

  for (var i=0; i<particles.length; i++){
    if (!particles[i].edges()){
      particles[i].update(amp > 100)
      particles[i].show()
    }else{
      particles.splice(i, 1)
    }
  }



}

function mouseClicked(){
  if(song.isPlaying()){
    song.pause()
    noLoop()
  }else{
    song.setVolume(0.05)
    song.play()
    loop()
  }
}

class Particle{
  constructor(){
    this.pos = p5.Vector.random2D().mult(250)
    this.vel = createVector(0, 0)
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001))
    this.w = random(3, 5)
    this.color = [random(200, 255), random(200, 250), random(200, 250)]
  }
  update(cond){
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    if (cond){
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
    }
  }
edges(){
  if (this.pos.x < -width / 2 || this.pos.x > width / 2 ||
  this.pos.y < -height / 2 || this.pos.y > height / 2){
    return true
  } else return false
}

  show(){
    noStroke()
    fill(this.color)
    ellipse(this.pos.x, this.pos.y, this.w)
  }
}
