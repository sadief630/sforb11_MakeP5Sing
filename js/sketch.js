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

let sounds = new Tone.Players({
  squish: 'images/Squish.wav',
  miss: 'images/Miss.wav',
  spawn: 'images/Spawn.wav',
  time: 'images/Time.wav'
}).toDestination();


//BEGIN SCREEN MUSIC CODE BLOCK
let beginSynth = new Tone.PolySynth({
  envelope: {
    sustain: .09,
    release: .02,
    attack: 0.01
  }
}).toDestination();
let introPattern = new Tone.Pattern((time,note)=>{
  if(gameState != 'end' && gameState != 'playing'){
    beginSynth.triggerAttackRelease(note,'8n', time);
  }
},[ 
  ['C3','G4','E4','C4'], 
  ['G4','C5'],
  ['C3','G4','E5'], 
  ['G4','C5'],
  ['A3','C4','F4','D5'], 
  ['C4','E5'],
  ['A3','C5'], 
  ['C4','F4','A4'],
  ['A3','C4','E4','A5'], 
  ['C4','A4','B5'],
  ['A3','C4','C5'], 
  ['C4','A4','D5'], 
  ['G3','D4','C4'], 
  ['D4','B4','D5'], 
  ['G3','D4','B4','G4'], 
  ['D4','B4','D4'], 
]).start(0);
//END OF BEGIN SCREEN MUSIC CODE BLOCK

//PLAY SCREEN MUSIC CODE BLOCK
const playSong = [
  {'time': '0:0:0', 'note': 'G2', 'duration': '4n'},
  {'time': '0:1:0', 'note': 'D3', 'duration': '4n'},
  {'time': '0:2:0', 'note': 'G2', 'duration': '4n'},
  {'time': '0:3:0', 'note': 'D3', 'duration': '4n'},

  {'time': '0:4:0', 'note': 'G2', 'duration': '4n'},
  {'time': '0:5:0', 'note': 'D3', 'duration': '4n'},
  {'time': '0:6:0', 'note': 'G2', 'duration': '4n'},
  {'time': '0:7:0', 'note': 'D3', 'duration': '4n'},
  
  {'time': '0:8:0', 'note': 'G2', 'duration': '4n'},
  {'time': '0:9:0', 'note': 'D3', 'duration': '4n'},
  {'time': '0:10:0', 'note': 'G2', 'duration': '4n'},
  {'time': '0:11:0', 'note': 'D3', 'duration': '4n'},
  
  {'time': '0:4:0', 'note': 'A3', 'duration': '2n'},
  {'time': '0:6:0', 'note': 'B3', 'duration': '2n'},
  {'time': '0:8:0', 'note': 'C4', 'duration': '2n'},
  {'time': '0:10:0', 'note': 'B3', 'duration': '2n'},
  {'time': '0:12:0', 'note': 'G3', 'duration': '2n'},
  {'time': '0:14:0', 'note': 'D3', 'duration': '2n'},

  {'time': '0:8:0', 'note': 'G3', 'duration': '8n'},
  {'time': '0:9:0', 'note': 'B4', 'duration': '8n'},
  {'time': '0:10:0', 'note': 'C5', 'duration': '8n'},
  {'time': '0:11:0', 'note': 'D4', 'duration': '8n'},
  {'time': '0:12:0', 'note': 'F4', 'duration': '8n'},
  {'time': '0:13:0', 'note': 'E4', 'duration': '8n'},
  {'time': '0:14:0', 'note': 'G4', 'duration': '8n'},
  {'time': '0:15:0', 'note': 'D4', 'duration': '8n'},

  {'time': '0:12:0', 'note': 'G2', 'duration': '4n'},
  {'time': '0:13:0', 'note': 'D3', 'duration': '4n'},
  {'time': '0:14:0', 'note': 'G2', 'duration': '4n'},
  {'time': '0:15:0', 'note': 'D3', 'duration': '4n'},
  
]

const playTrack = new Tone.Part(function(time,note){
  beginSynth.triggerAttackRelease(note.note,note.duration,time);
}, playSong);
playTrack.loop = true;
playTrack.loopEnd = "0:16:0";
//END OF PLAY SCREEN MUSIC CODE BLOCK

// END SCREEN MUSIC CODE BLOCK
let synth = new Tone.AMSynth({
  envelope: {
    sustain: 1,
    release: 1,
    attack: 0.02
  }
}).toDestination();
let pattern = new Tone.Pattern((time,note)=>{
  if(gameState == 'end'){
    synth.triggerAttackRelease(note,0.25, time);
  }
},['D4', 'F4', 'A3', 'F4']).start(0);
let synthB = new Tone.AMSynth({
  envelope: {
    sustain: 1,
    release: 1,
    attack: 0.02
  }
}).toDestination();
let patternB = new Tone.Pattern((time,note)=>{
  if(gameState == 'end'){
    synthB.triggerAttackRelease(note,0.5, time);
  }
},['D2', 'A3']).start(0);
let synthC = new Tone.FMSynth({
  envelope: {
    sustain: .03,
    release: 1,
    attack: 0,
  }
}).toDestination();
let patternC = new Tone.Pattern((time,note)=>{
  if(gameState == 'end'){
    synthB.triggerAttackRelease(note,0.125, time);
  } 
},['D4', 'F4', null, 'A4', 'F4', null,'E4','D4']).start(0);
// END OF END SCREEN MUSIC CODE BLOCK

function setup() {
  imageMode(CENTER);
  createCanvas(700, 700);
  for(i = 0; i < count; i++){
    bugArray[i] = new Bug(random([spriteSheet, spriteSheet2]), random(100,650), random(100,650), random(1,4), random([-1, 1])); //create array of bugs!
  }
  
}

function draw(){
  introPattern.start();
  Tone.Transport.start();
  background(255);
  image(floor, 350, 350); //background image
  fill(255);
    if(gameState == 'wait'){
      pattern.start();
      patternB.start();
      patternC.start();
      //TITLE SCREEN
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
      if(mouseIsPressed){ //Timer Start, Game Start
        startTime = millis();
        gameState = 'playing'; 
        sounds.player('spawn').start();
        //breaks if statement, switch to new music
      }   
  }
  else if(gameState == 'playing'){
    playTrack.start();
    for(i = 0; i < count ; i++){
      bugArray[i].draw(); //draw all sprites, up to count on the screen at all times
    }
    textSize(32);
    let time = timer(); //call timer function to record time
    text('score: ' + numSquished, 500, 40); // score keeper
    text(' time: ' + (30 - time), 10, 40); //time countdown
    if(time >= 24 && time <= 28){
      if(frameCount%108==0){
        sounds.player('time').start();
      }    
    }
    if(time >= 30){
      gameState = 'end';
      playTrack.stop(); //breaks if statement
    } 
  }
  else if(gameState == 'end'){
    Tone.Transport.bpm.value = 120;
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
  let squished = false;
  for(i = 0; i < count ; i++){
    if(bugArray[i].kill() && (grabbedArray[i] == false)){
        grabbedArray[i] = true;
        if(!squished){
          sounds.player('squish').start();
          Tone.Transport.bpm.value += 5; 
        }
        squished = true;
        for(j = 0; j < count ; j++){
          bugArray[j].speed += .1;
         
        }
    }
    else{
      grabbedArray[i] = false;
    }
  }
  if(gameState == 'playing' && !squished){
    sounds.player('miss').start();
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
      this.x = random([0,700]);
      this.y = random(100,650);
      this.move = random([-1,1]);
      this.facing = this.move;
      this.grabbed = false;
    }
    pop();
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