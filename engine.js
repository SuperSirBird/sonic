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
  
  x = x2_+(projdis*sin(projangle));
  y = y2_+(projdis*cos(projangle));
}
