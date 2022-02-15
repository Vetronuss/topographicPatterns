var size = 4;
var n = [];
var lines = []
var detail = 2
var detailSlider
var crv = true;
var cDetail
var cTight
var crvChx;
function setup() {
  createCanvas(windowWidth, windowHeight);
  noiseDetail(5,0.1);
  noiseSeed(0)
  noStroke();
  frameRate(60)
  for (var i = 0; i < 100; i++)
  {
    n.push([]);
    for (var o = 0; o < 100; o++)
    {
      var na = floor(noise(i/17,o/17)*10)
      na = map(na,0,10,0,255)
      n[i].push(na)
    }
  }
  n = edgeDetect(2);
  findLines();
  detailSlider = createSlider(1,10,1,1)
  detailSlider.position(0,height - height/16*5)
  cDetail = createSlider(3,30,20,1)
  cDetail.position(0,height-height/16*4)
  cTight = createSlider(-2,2,0,0.1)
  cTight.position(0,height-height/16*3)
  crvChx = createCheckbox("Use Curves",true)
  crvChx.position(0,height-height/16*2)
}
var seed = 0;
function draw() {
  background(220);
  textAlign(LEFT,BOTTOM)
  text("Interpolation: ", 10,height-height/16*5)
  text("Curve Detail: ", 10,height-height/16*4)
  text("Curve Tightness: ", 10,height-height/16*3)
  /*
  for (var i = 0; i < 100; i++)
  {
    for (var o = 0; o < 100; o++)
    {
      fill(n[i][o])
      rect(100+i*4,100+o*4,4,4)
    }
  }*/
  crv = crvChx.checked();
  curveTightness(cTight.value());
  curveDetail(cDetail.value())
  detail = detailSlider.value();
  var perlinZ = (millis()/2000)
  text("Perlin Z value: " + round(perlinZ,2),width/2,height-height/4)
  noiseSeed(seed)
  drawScreen();
  if (true)
  {
    n = [];
    lines = []
    for (var i = 0; i < 100; i++)
  {
    n.push([]);
    for (var o = 0; o < 100; o++)
    {
      var na = floor(noise(i/17,o/17,perlinZ)*10)
      na = map(na,0,10,0,255)
      n[i].push(na)
    }
  }
  n = edgeDetect(2);
  findLines();
  }
}
  
function drawScreen()
{
    
noFill();
  stroke(0)
  rect(0,0,n.length*size,n.length*size)
  for (var i = 0; i < lines.length; i++)
  {
    beginShape()
    var prev;
    var first = true;
    var sec = true;
    var start;
    var secVert
    for (var o = 0; o < lines[i].length; o++){
      if (o%detail==0){
        
        if (o > 1 && dist(prev.x,prev.y,lines[i][o].x*size,lines[i][o].y*size) > 40)
        {
          continue
        }
          if (!first && sec)
          {
            sec = false;
            secVert = createVector(lines[i][o].x*size,lines[i][o].y*size);
          }
          if (first)
          {
            first = false;
            start = createVector(lines[i][o].x*size,lines[i][o].y*size);
            vertex(lines[i][o].x*size,lines[i][o].y*size)
          }
          
        if (crv){
        curveVertex(lines[i][o].x*size,lines[i][o].y*size)
        }else
        {
          vertex(lines[i][o].x*size,lines[i][o].y*size)
        }
        prev = createVector(lines[i][o].x*size,lines[i][o].y*size)
      }
      
    }
      //check if near side
      
      
      
      //find closest side cause all other sides wouldnt need to be accessed
      var closestEdge = findEdge(prev.x,prev.y)
      if (dist(closestEdge[0],closestEdge[1],prev.x,prev.y) < 30)
      {
        if (crv){
        curveVertex(closestEdge[0],closestEdge[1])
        }else
        {
          vertex(closestEdge[0],closestEdge[1])
        }
        
      }
      
      
      
      
      
      //if first is far from last;
      if (dist(prev.x,prev.y,start.x,start.y) > 30)
      {
        if (crv){
        curveVertex(prev.x,prev.y)
        }else
        {
          vertex(prev.x,prev.y)
        }
        endShape()
      }else{
        if (crv){
        curveVertex(start.x,start.y)
        }else
        {
          vertex(start.x,start.y)
        }
        try{
        if (crv){
        curveVertex(secVert.x,secVert.y)
        }else
        {
          vertex(secVert.x,secVert.y)
        }
        }catch(a)
        {
          //if there is a line with a very low amount of verts
        }
        endShape()
      }
      if (true){
        push();
        stroke('red')
        strokeWeight(3)
        point(start.x,start.y)
        stroke('blue')
        point(prev.x,prev.y)
        stroke('green')
        try{
        point(secVert.x,secVert.y)
        }catch(a)
        {
          //wil throw error if not enough points
        }
        pop();
      }
  }

}

function edgeDetect(offset)
{
  var b = [];
  for (var i = 0; i < n.length; i++)
  {
    b.push([])
    for (var o = 0; o < n[i].length; o++)
    {
      if (o+1 >= n[i][o].length || i+1 >= n[i].length)
      {
        if ((abs(n[i][o-1] - n[i][o] ) > offset)||(abs(n[i-1][o] - n[i][o] ) > offset))
      {
        b[i].push(255);
      }else
      {
        b[i].push(0);
      }
        continue;
      }
      if ((abs(n[i][o+1] - n[i][o] ) > offset)||(abs(n[i+1][o] - n[i][o] ) > offset))
      {
        b[i].push(255);
      }else
      {
        b[i].push(0);
      }
      
      
    }
  }
  return b;
}

  
  function findEdge(x,y)
  {
    //all sides
      var sides = [
        [createVector(0,0),createVector(0,n.length*size)],
        [createVector(0,n.length*size),createVector(n.length*size,n.length*size)],
        [createVector(n.length*size,n.length*size),createVector(n.length*size,0)],
        [createVector(n.length*size,0),createVector(0,0)]];
    var closestSide = sides[0];
      var closestDist = 1000000;
      for (var t = 0; t < sides.length; t++)
      {
        var test = perp(x,y,sides[t][0].x,sides[t][0].y,sides[t][1].x,sides[t][1].y)
        var testDist = dist(x,y,test[0],test[1])
        if (testDist < closestDist)
        {
          closestDist = testDist;
          closestSide = test;
        }
      }
      
      return [closestSide[0],closestSide[1]]
  }  
function findLines()
{
  for (var i = 0; i < n.length; i++)
  {
    for (var o = 0; o < n[i].length; o++)
    {
      if (n[i][o] == 255)
      {
        lines.push([]);
        search(i,o,lines.length-1)
      }
    }
  }
}

function search(x,y,index)
{
  n[x][y] = 254;
  lines[index].push(createVector(x,y))
  try{
    if (n[x+1][y] == 255)
    {
      search(x+1,y,index)
    }
  }catch(a){}
  try{
  if (n[x-1][y] == 255)
  {
    search(x-1,y,index)
  }
    }catch(a){}
  try{
  if (n[x][y+1] == 255)
  {
    search(x,y+1,index)
  }
    }catch(a){}
  try{
  if (n[x][y-1] == 255)
  {
    search(x,y-1,index)
  }
    }catch(a){}
  try{
  if (n[x+1][y+1] == 255)
  {
    search(x+1,y+1,index)
  }
    }catch(a){}
  try{
  if (n[x-1][y-1] == 255)
  {
    search(x-1,y-1,index)
  }
    }catch(a){}
  try{
  if (n[x-1][y+1] == 255)
  {
    search(x-1,y+1,index)
  }
    }catch(a){}
  try{
  if (n[x+1][y-1] == 255)
  {
    search(x+1,y-1,index)
  }
    }catch(a){}
}

  
  
  //The rest of the file is helper functions

  
  //finds closest point on a line
function perp(px,py,x1,y1,x2,y2)
{
  let slope = atan2(y2-y1,x2-x1);
  let perpSlope = slope+radians(90);
  let perpSlope2 = slope-radians(90);
  let int1 = intersect(px,py,px+cos(perpSlope)*1000,py+sin(perpSlope)*1000,x1,y1,x2,y2)
  
  let int2 = intersect(px,py,px+cos(perpSlope2)*1000,py+sin(perpSlope2)*1000,x1,y1,x2,y2)
 
 
  if (int1 != false)
  {
    return int1;
  }else if (int2 != false)
  {
    return int2;
  }else
  {
    if (distance(px,py,x1,y1) > distance(px,py,x2,y2))
    {
      return [x2,y2];
    }else
    {
      return [x1,y1]
    }
  }
  //https://monkeyproofsolutions.nl/wordpress/how-to-calculate-the-shortest-distance-between-a-point-and-a-line/
}
  
function distance(x1,y1,x2,y2)
{
  var distance = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
  return distance;
}

function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {

  // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false
    }

    denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

  // Lines are parallel
    if (denominator === 0) {
        return false
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

  // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false
    }

  // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)
    
    return [x, y]
}
