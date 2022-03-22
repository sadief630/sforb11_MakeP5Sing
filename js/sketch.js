// Sadie Forbes
// CSC 2364 Bug Squish Project
// Feb 15 2022

let floor;
let spriteSheet;
let count = 12;
let sx;
let x;
let y;
let move;
let facing;
let speed;
let grabbed;
let death;
let bugArray=[];
let grabbedArray=[];
let i;
let j;
let numSquished = 0;
let gameState = 'wait';

function preload(){
  spriteSheet = loadImage("images/BugSquishy.png");
  spriteSheet2 = loadImage("images/BugSquishy2.png");
  floor = loadImage("images/maxresdefault.png");
}

let osc = new Tone.AMOscillator(300,'sine','sine').start()
let gain = new Tone.Gain().toDestination();
let pan = new Tone.Panner().connect(gain);
let ampEnv = new Tone.AmplitudeEnvelope({
  sustain: 0,
  decay: 1,
  release: 0.04,
  attack: .1
}).connect(pan);
osc.connect(ampEnv);

let noise = new Tone.Noise('brown').start();
let noiseEnv = new Tone.AmplitudeEnvelope({
  sustain: .9,
  decay: .5,
  release: .03,
  attack: .01
}).connect(gain);
let noiseFilter = new Tone.Filter(300, 'highpass').connect(noiseEnv);
noise.connect(noiseFilter);

function setup() {
  imageMode(CENTER);
  createCanvas(700, 700);
  for(i = 0; i < count; i++){
    bugArray[i] = new Bug(random([spriteSheet, spriteSheet2]), random(100,650), random(100,650), random(1,4), random([-1, 1])); //create array of bugs!
  }
}
function draw(){
  background(255);
  image(floor, 350, 350); //background image
  fill(255);
  if(gameState == 'wait'){ //TITLE SCREEN
        textSize(80);
        textFont('Georgia');
        text("BUG SQUISH", 100, 250);
        textFont('monospace');
        textSize(40);
        text('Press any key to start', 100, 350);
        textSize(20);
        text('Squish as many bugs as possible in 30 seconds!',90,400);
        image(spriteSheet,150, 500, 70, 70, 200, 0, 200, 200);
        image(spriteSheet2,250, 500, 70, 70, 200, 0, 200, 200);
        image(spriteSheet,350, 500, 70, 70, 200, 0, 200, 200);  //images for aesthetic reasons
        image(spriteSheet2,450, 500, 70, 70, 200, 0, 200, 200);
        image(spriteSheet,550, 500, 70, 70, 200, 0, 200, 200);
        if(keyIsPressed || mouseIsPressed){ //Timer Start, Game Start
          startTime = millis();
          gameState = 'playing'; //breaks if statement
        }
  }
  else if(gameState == 'playing'){
    for(i = 0; i < count ; i++){
      bugArray[i].draw(); //draw all sprites, up to count on the screen at all times
    }
    textSize(32);
    let time = timer(); //call timer function to record time
    text('score: ' + numSquished, 500, 40); // score keeper
    text(' time: ' + (30 - time), 10, 40); //time countdown
    if(time >= 30){
      gameState = 'end'; //breaks if statement
    }
  }
  else if(gameState == 'end'){ //GAME OVER SCREEN
    textFont('Georgia');
    text('GAME OVER', 260, 300);
    textFont('monospace');
    //score thresholds (added for aesthetic purposes)
    text('score: ' + numSquished, 280, height/2);
    if(numSquished < 10){
      text('Better luck next time!   ', 155, 400);
    }
    else if(numSquished >= 10 && numSquished < 25){
      text('      Good Score!     ', 155, 400);
    }
    else if(numSquished >= 25 && numSquished < 40){
      text('       Great Job!       ', 155, 400);
    }
    else{
      text('        Amazing!        ', 155, 400);
    }
    text('Refresh the page to restart', 110, 500);
  }
}

function timer(){
  return int((millis() - startTime)/1000); //converts length from starttime to seconds
}

function mousePressed(){ //determines whether to kill the pressed bug and speed other bugs up
  for(i = 0; i < count ; i++){
    if(bugArray[i].kill() && (grabbedArray[i] == false)){
        grabbedArray[i] = true;
        ampEnv.triggerAttackRelease('2n');
          for(j = 0; j < count ; j++){
            bugArray[j].speed += .1;
          }
    }
    else{
      if(gameState == 'playing'){
        
        noiseEnv.triggerAttackRelease('16n');
      }
      grabbedArray[i] = false;
    }
  }
}


// the Bug class controls animations, speed, and individual bug characteristics
// the Bug class also controls the "squish" frames and resetting stats for respawn
class Bug{
  constructor(spriteSheet, x, y, speed, move){
    this.spriteSheet = spriteSheet;
    this.death = -10000; 
    this.sx = 0;
    this.x = x;
    this.y = y
    this.move = 0;
    this.facing = move;
    this.speed = speed;
    this.move = move; 
    this.grabbed = false;
}
  
  draw(){
    push();
    translate(this.x,this.y);
    scale(this.facing,1);
    if(this.move == 0){
      image(this.spriteSheet, 0, 0, 70, 70, 200, 200, 200, 200);
    }
    else{
      image(this.spriteSheet, 0, 0, 70, 70, 200 * this.sx, 0, 200, 200);
    }
    if(frameCount % 5 ==0){
      this.sx = (this.sx + 1) % 6;
    }
    this.x += this.speed * this.move;
    if(this.x < 0){
      this.move = 1;
      this.facing = 1;
    }
    else if(this.x > width){
      this.move = -1;
      this.facing = -1;
    }

   if(this.death == frameCount - 80){ //"respawns" bug by resetting stats after certain number of frames
      this.x = random(100,650);
      this.y = random(100,650);
      this.move = random([-1,1]);
      this.facing = this.move;
      this.grabbed = false;
    }
    pop();
  }
 
 go(direction){
    this.move = direction;
    this.facing = direction;
    this.sx = 3;
  }

  stop(){
    this.move = 0;
  }
  
  kill(){
    if(mouseX > this.x - 30 && mouseX < this.x + 30 &&
       mouseY > this.y - 30 && mouseY < this.y + 30){
        if(this.grabbed == false){
          numSquished++;
          this.death = frameCount;
        }
        this.grabbed = true;
        this.stop();
        return true;
       }

       return false;
  }
}