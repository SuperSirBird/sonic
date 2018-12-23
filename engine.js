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
ctx.save();
ctx.restore();

// Variables
var camoffx = 0;

var x;
var y;
var playerx = 0;
var playery = 100;
var playersize = 30;
var linesize = 15;
var gravdir;
var accelerate = 0;
var onground;
var closeline = 0;
var rota;

// Keys detector
var keys = {};
window.onkeyup = function(e) { keys[e.keyCode] = false; }
window.onkeydown = function(e) { keys[e.keyCode] = true; }

// Map
var linex1 = [-300,300,300,-300];
var liney1 = [-300,-300,300,300];
var linex2 = [300,300,-300,-300];
var liney2 = [-300,300,300,-300];

function dist(x_,y_) {
  // Pythagorean Theorem
  return Math.sqrt((x_*x_)+(y_*y_));
}

function gx(x_) {return ((x_-playerx)+window.innerWidth/2)}
function gy(y_) {return (((y_-playery)*-1)+window.innerHeight/2)}

function sonicsprite() {
  ctx.save();
  var img = document.getElementById("sonicwalk");
  
  // Centering Sonics Position
  var transx = gx(playerx-((playersize*2.5)/2)*Math.sin(rota));
  var transy = gy(playery-((playersize*2.5)/2)*Math.cos(rota));
  
  transx -= ((playersize*2.5)/2)*Math.sin(rota+(270*Math.PI/180));
  transy -= ((playersize*2.5)/2)*Math.cos(rota+(90*Math.PI/180));
  
  ctx.translate(transx,transy);
  
  // Find Rotation
  
  ctx.rotate(rota+(180*Math.PI/180));
  ctx.drawImage(img, 0, 0,playersize*2.5,playersize*2.5);
  ctx.restore();
}

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

function getclose() {
  var oldl = closeline;
  var smallestdis = 99999999;
  var smallestitem = 1;
  for (i=0;i<linex1.length;i++) {
    linepoint(linex1[i],liney1[i],linex2[i],liney2[i],playerx,playery);
    if (dist(x-playerx,y-playery)<smallestdis) {
      smallestdis=dist(x-playerx,y-playery)
      smallestitem=i;
    }
  }
  closeline=smallestitem;
  if (closeline != oldl) {accelerate=0}
}

function player() {
  linepoint(linex1[closeline],liney1[closeline],linex2[closeline],liney2[closeline],playerx,playery);
  
  // Jump/fall handling
  
  accelerate+=1;
  var jumpframe = false;
  if (keys[32] && onground==1) {
    accelerate = -20;
    jumpframe = true;
  }
  onground=1;
  // Check for obj's loop
  if (dist(x-playerx,y-playery)>(playersize+linesize+10) || jumpframe) {
    if (accelerate>20) {accelerate=20}
    playerx+=accelerate*Math.sin(Math.atan2(x-playerx,y-playery))
    playery+=accelerate*Math.cos(Math.atan2(x-playerx,y-playery))
    onground=0;
  }
  linepoint(linex1[closeline],liney1[closeline],linex2[closeline],liney2[closeline],playerx,playery);
  if (dist(x-playerx,y-playery)<(playersize+linesize+10) && !(jumpframe)) {
    accelerate=0;
    playerx+=Math.sin(Math.atan2(x-playerx,y-playery))*(-((playersize+linesize+10)-dist(x-playerx,y-playery)))
    playery+=Math.cos(Math.atan2(x-playerx,y-playery))*(-((playersize+linesize+10)-dist(x-playerx,y-playery)))
    onground=1;

  }
  // Player XY move
  if (keys[39]) {
    playerx+=Math.sin((90*(Math.PI/180))+Math.atan2(x-playerx,y-playery))*-6
    playery+=Math.cos((90*(Math.PI/180))+Math.atan2(x-playerx,y-playery))*-6
    camoffx = camoffx+((200-camoffx)/3)
  }
  if (keys[37]) {
    playerx+=Math.sin((-90*(Math.PI/180))+Math.atan2(x-playerx,y-playery))*-6
    playery+=Math.cos((-90*(Math.PI/180))+Math.atan2(x-playerx,y-playery))*-6
    camoffx = camoffx+((-200-camoffx)/3)
  }
  
  rota = Math.atan2(x-playerx,y-playery);

  
  // Draw Player
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(gx(playerx), gy(playery), playersize, 0, 2 * Math.PI);
  ctx.stroke();
  sonicsprite();
}

function draw() {
  ctx.lineCap = "round";
  ctx.lineWidth = linesize*2;
  for (i=0;i<linex1.length;i++) {
    ctx.beginPath();
    ctx.moveTo(gx(linex1[i]),gy(liney1[i]));
    ctx.lineTo(gx(linex2[i]),gy(liney2[i]));
    ctx.stroke();
  }
}

function step() {
  // Program Main Loop
  ctx.clearRect(0, 0, c.width, c.height);
  draw();
  getclose();
  player();
  window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);
