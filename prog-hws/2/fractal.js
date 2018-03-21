var canvas = document.getElementById('my_canvas'),
    ctx = canvas.getContext('2d');
var repeater = null;    
var prim = "line";

r1 = document.getElementById("r1");
r1.checked = true;

var slide = document.getElementById('s1'),
    sliderDiv = document.getElementById("sliderAmount");

function set_line(){prim = "line"}
function set_arc(){prim = "arc"}
var sval = document.getElementById("s1").value;

$('div.carDiv').click(function(){
    // i want to stop itterating so it does not flash
    r1 = document.getElementById("r1");
    r2 = document.getElementById("r2");
    r1.checked = false;
    r2.checked = true;
    
    r_buttons();
});

var started = false;
function colors(){
    started = !started;

    if(started)
	repeat2 = coolColors();
    else
	clearInterval(repeat2);
	ctx.clearRect(0, 0, 200, 200);

}

var started2 = false;
function carWheels(){
    started = !started;

    if(started)
	repeat3 = wheels();
    else
	clearInterval(repeat3);
	ctx.clearRect(420, 0, 600, 200);

}

function r_buttons(){
    sval = document.getElementById("s1").value;
    if(document.getElementById('r3').checked) {
	set_line();
	fractal(sval);
    }

    if(document.getElementById('r4').checked) {
	set_arc();
	fractal(sval);
    }

    
    if(document.getElementById('r1').checked) {
	i =6;
	j =7;
	if(typeof repeater !== 'undefined'){
	    window.clearInterval(repeater);
	    ctx.clearRect(0, 0, 600, 410);
	}
	repeater = window.setInterval(function(){
	    if(j>=7){i--;}
	    if(j>11){j=1;}
	    if(j<7){i++;}
	    j++;
	  
	    fractal(i)
	}, 1000);        		  			  
    } else {
	window.clearInterval(repeater);
	ctx.clearRect(0, 0, 600, 410);
    }
	  
    if(document.getElementById('r2').checked) {
	fractal(sval);
    }
}

slide.onchange = function() {
    var val = this.value;
    /* DOES NOT WORK FOR SOME REASON??
      if(val == 1)
	val = 6;
    if(val == 2)
	val = 5;
    if(val == 3)
	val = 4;
    if(val == 4)
	val = 3;
    if(val == 5)
	val = 2;
    if(val == 6)
	val = 1;*/
    sliderDiv.innerHTML = val;

    r_buttons();
}
    


//call my buttons function at the start.
r_buttons();

//pass in 1 to 6..
function fractal(iters){ 
    ctx.clearRect(0, 0, 600, 410);    
    
    drawKochCurve(20.0, 300.0, 600.0, 300.0, '#000', Math.PI/3, 10 ** iters);

}

    
function drawLine(x1,y1,x2,y2, color)
{
    ctx.fillStyle = '#000';
    ctx.strokeStyle = color;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1); 
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();  
}

function drawArc(x1,y1,x2,y2, color)
{
    ctx.fillStyle = '#000';
    ctx.strokeStyle = color;

    ctx.beginPath();

    ctx.arc(x1,y1,50,0,Math.PI,false);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();  
}    



function drawKochCurve(x1, y1, x2, y2, color, alfa, k){
    if( ((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1)) < k) {
	if(prim.includes("arc")){
	    drawArc(x1,y1,x2,y2, color);
	} else if(prim.includes("line")) {
            drawLine(x1,y1,x2,y2, color);
	}
	
	return;
						     }

    var xa = x1 + 1/3 * (x2 - x1),
	ya = y1 + 1/3 * (y2 - y1),
	
	xb = x1 + 2/3 * (x2 - x1),
	yb = y1 + 2/3 * (y2 - y1),
  
	xc = xa + (xb - xa) * Math.cos(-alfa) - (yb - ya) * Math.sin(-alfa),
	yc = ya + (yb - ya) * Math.cos(-alfa) + (xb - xa) * Math.sin(-alfa);
  
    drawKochCurve(x1,y1, xa,ya, color, alfa, k);
    drawKochCurve(xa,ya, xc,yc, color,alfa, k);
    drawKochCurve(xc,yc, xb,yb, color, alfa, k);
    drawKochCurve(xb,yb, x2,y2, color, alfa, k);  
  
}

						    
function coolColors(){
    var degK = Math.PI/180;
    var deg = 0;
    var aa = 1;
    repeat2 = setInterval(function(){
	//ctx.clearRect(20, 210, canvas.width, canvas.height);
	
	drawKochCurve(20.0, 40.0, 200.0, 200.0, "rgb(" + Math.floor((Math.random()*255)) + ","+Math.floor((Math.random()*255))+","+Math.floor((Math.random()*255))+")", deg * degK, 1);
  
	deg += aa;
	if (0 == deg || 60 == deg) aa *= -1;
	if (deg == 0) ctx.clearRect(20, 210, canvas.width, canvas.height);

    }, 30);
    return repeat2;
}

function wheels(){
    repeat3 = setInterval(function(){
	drawCircle();

    }, 50);

    return repeat3;
}

function drawCircle(){
    var centerX = 500;
    var centerY = 100;
    var radius = 70;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.lineWidth = 10;
    ctt.strokeStyle = '#003300';
    ctx.stroke();
}
