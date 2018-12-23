/* Engine js

A Javascript Sonic Physics Engine

@author: SuperSirBird (Github)
@description: A sonic js physics engine
@date: 22/12/2018 AUS
@credit: Sonic Inspriation

Feel free to use engine in other projects
however credit would be appriciated

*/

/*
Begin Code
*/

// Setup Canvas

var c = document.getElementById("myCanvas");
var ctx=c.getContext("2d");
c.width  = window.innerWidth;
c.height = window.innerHeight;

// Variables

var x;
var y;
var playerx = 0;
var playery = 400;
var playersize = 30;
var linesize = 15;
var gravdir;
var accelerate = 0;

// Keys detector
var keys = {};
window.onkeyup = function(e) { keys[e.keyCode] = false; }
window.onkeydown = function(e) { keys[e.keyCode] = true; }

function dist(x_,y_) {
  // Pythagorean Theorem
  return Math.sqrt((x_*x_)+(y_*y_));
}

function gx(x_) {return (x_+window.innerWidth/2)}
function gy(y_) {return ((y_*-1)+window.innerHeight/2)}

function linepoint(x1_,y1_,x2_,y2_,x_,y_) {
  // Projected Length Formula = (AB*AC)/|AB|
  // In this case = ((x1*x2)+(y1*y2))/Math.sqrt((x1*x1)+(y1*y1)) substituting x1,y1 for n1-n2
  
  x1_ = x1_-x2_
  y1_ = y1_-y2_
  x_ = x_-x2_
  y_ = y_-y2_
  
  var dot = (x1_*x_)+(y1_*y_);
  var projangle = Math.atan2(x1_,y1_)
  var projdis = dot/Math.sqrt((x1_*x1_)+(y1_*y1_))
  
  if (projdis<0) {projdis=0}
  if (projdis>Math.sqrt((x1_*x1_)+(y1_*y1_))) {projdis=Math.sqrt((x1_*x1_)+(y1_*y1_))}
  
  x = x2_+(projdis*Math.sin(projangle));
  y = y2_+(projdis*Math.cos(projangle));
}

function player() {
  linepoint(-500,-300,500,300,playerx,playery);
  accelerate+=1;
  if (accelerate>20) {accelerate=20}
  
  playerx+=accelerate*Math.sin(Math.atan2(x-playerx,y-playery))
  playery+=accelerate*Math.cos(Math.atan2(x-playerx,y-playery))
  linepoint(-500,-300,500,300,playerx,playery);
  // Check for obj's loop
  if (dist(x-playerx,y-playery)<playersize+linesize+20) {
    accelerate=0;
    playerx+=Math.sin(Math.atan2(x-playerx,y-playery))*-(playersize+linesize+20-dist(x-playerx,y-playery))
    playery+=Math.cos(Math.atan2(x-playerx,y-playery))*-(playersize+linesize+20-dist(x-playerx,y-playery))
    
  }
  if (dist(x-playerx,y-playery)>playersize+linesize+20) {
    
  }
  
  if (keys[32]) {accelerate = -8}
  
  // Draw Player
  
  ctx.beginPath();
  ctx.arc(gx(playerx), gy(playery), playersize, 0, 2 * Math.PI);
  ctx.stroke();
}

function draw() {
  ctx.lineCap = "round";
  ctx.lineWidth = linesize;
  ctx.beginPath();
  ctx.moveTo(gx(-400),gy(-300));
  ctx.lineTo(gx(400),gy(300));
  ctx.stroke();
}

function step() {
  // Program Main Loop
  ctx.clearRect(0, 0, c.width, c.height);
  draw();
  player();
  window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);
