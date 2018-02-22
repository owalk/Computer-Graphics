function draw_pixel(ctx, point_x, point_y, red, green, blue)
{
    var myImageData = ctx.createImageData(1, 1);
    myImageData.data[0]=red;
    myImageData.data[1]=green;
    myImageData.data[2]=blue;
    myImageData.data[3]=255;
    ctx.putImageData(myImageData, point_x, point_y);
}
function draw_line(ctx, x0, y0, x1, y1, white) {
    var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1; 
    var err = (dx>dy ? dx : -dy)/2;
    var red = 0;
    var green = 0;
    var blue = 255;
    if(white == true){
	red = 255;
	green = 255;
	blue = 255;
    }
    while (true) {
	draw_pixel(ctx,x0,y0,red, green, blue);
	if (x0 === x1 && y0 === y1) break;
        var e2 = err;
	if (e2 > -dx) { err -= dy; x0 += sx; }
        if (e2 < dy) { err += dx; y0 += sy; }
    }
}
function draw_circle(ctx, centerX, centerY, radius, white) 
{
    d = (5 - radius * 4)/4;
    x = 0;
    y = radius;
    var red, green, blue;
    if(white == true){ //white it out 
	red = 255;
	green = 255;
	blue = 255;
    } else {
	red = 50;
	green = 200;
	blue = 100;
    }
    do {
	
	draw_pixel(ctx,centerX + x, centerY + y,red,green,blue);
	    draw_pixel(ctx,centerX + x, centerY - y,red,green,blue);
	    draw_pixel(ctx,centerX - x, centerY + y,red,green,blue);
	    draw_pixel(ctx,centerX - x, centerY - y,red,green,blue);
	    draw_pixel(ctx,centerX + y, centerY + x,red,green,blue);
	    draw_pixel(ctx,centerX + y, centerY - x,red,green,blue);
	    draw_pixel(ctx,centerX - y, centerY + x,red,green,blue);
	    draw_pixel(ctx,centerX - y, centerY - x,red,green,blue);
		if (d < 0) {
			d += 2 * x + 1;
		} else {
			d += 2 * (x - y) + 1;
			y--;
		}
		x = x + 1;
	} while (x <= y);
}
//////////////

function draw_ellipse(c, ctx, white){
    var centerX = 100, centerY = 50;
    var a = 90, b = 40;
    var a2 = a*a, b2 = b*b, fa2 = 4*a2, fb2 = 4*b2;
    var x = 0, y = b, sigma = 2*b2 + a2* (1-2*b);
    while(b2*x <= a2*y){
        ellipse_helper(ctx,centerX,centerY,x,y, white);
        if (sigma >=0){
            sigma += fa2*(1-y);
            y-=1;
        }
        sigma += b2*(4*x+6);
        x+=1;
    }
    
    x = a; y = 0; sigma = 2*a2 + b2* (1-2*a);
    while(a2*y <= b2*x){
        ellipse_helper(ctx,centerX,centerY,x,y, white);
        if (sigma >=0){
            sigma += fb2*(1-x);
            x-=1;
        }
        sigma += a2*(4*y+6);
        y+=1;
    }
}
function ellipse_helper(ctx, point_x, point_y, radius_x, radius_y, white){
    var red = 255, green = 0, blue = 0;
    if (white == true){
	red = 255;
	green = 255;
	blue = 255;
    }
    draw_pixel(ctx, point_x + radius_x, point_y + radius_y,red,green,blue);
    draw_pixel(ctx, point_x - radius_x, point_y + radius_y,red,green,blue);
    draw_pixel(ctx, point_x + radius_x, point_y - radius_y,red,green,blue);
    draw_pixel(ctx, point_x - radius_x, point_y - radius_y,red,green,blue);
}
