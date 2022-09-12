/**
 * @file
 *
 * @author Diego Malta
 * @since 12/09/2022
 */

"use strict";

/**
 * Raw data for some point positions -
 * this will be a square, consisting of two triangles.
 * <p>We provide two values per vertex for the x and y coordinates
 * (z will be zero by default).</p>
 * @type {Float32Array}
 */
var vertices = new Float32Array([
    -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
]);

/**
  * Number of points (vertices).
  * @type {Number}
  */
var numPoints = vertices.length / 2;

// A few global variables...

/**
  * Canvas width.
  * @type {Number}
  */
var w;

/**
  * Canvas height.
  * @type {Number}
  */
var h;

/**
  * Maps a point in world coordinates to viewport coordinates.<br>
  * - [-n,n] x [-n,n] -> [-w,w] x [h,-h]
  * <p>Note that the Y axix points downwards.</p>
  * @param {Number} x point x coordinate.
  * @param {Number} y point y coordinate.
  * @param {Number} n window size.
  * @returns {Array<Number>} transformed point.
  */
function mapToViewport(x, y, n = 5) {
    return [((x + n / 2) * w) / n, ((-y + n / 2) * h) / n];
}

/**
  * Returns the coordinates of the vertex at index i.
  * @param {Number} i vertex index.
  * @returns {Array<Number>} vertex coordinates.
  */
function getVertex(i) {
    let j = (i % numPoints) * 2;
    return [vertices[j], vertices[j + 1]];
}

/**
  * Code to actually render our geometry.
  * @param {CanvasRenderingContext2D} ctx canvas context.
  * @param {Number} scale scale factor.
  * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
  */
function draw(ctx, angulo, vertice) {
    
    ctx.fillStyle = "rgba(0, 200, 200, 1)";
    ctx.rect(0, 0, w, h);
    ctx.fill();

    let [x, y] = mapToViewport(...getVertex(vertice));
    ctx.translate(x,y)
    ctx.rotate(-angulo * Math.PI/180);
    ctx.translate(-x,-y)

    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
        if (i == 3 || i == 4) continue;
        let [x, y] = mapToViewport(...getVertex(i).map((x) => x ));
        if (i == 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();

    
    ctx.strokeStyle = "black";
    ctx.lineWidth = 7;
    ctx.stroke();

    //Gradient from red to blue
    var grd1 = ctx.createLinearGradient(0, 50, 50, 0);
    grd1.addColorStop(0, "red");
    grd1.addColorStop(1, "blue");

    //Gradient from white to green
    var grd2 = ctx.createLinearGradient(0,50,50,0);
    grd2.addColorStop(0, "white");
    grd2.addColorStop(1, "green");

    // Fill with gradient
    ctx.fillStyle = grd1;
    ctx.fill();

    
    //console.log(event.key);
        
    switch (vertice) {
    case 1:  
        ctx.fillStyle = grd2;
        ctx.fill();
        break;
    case 2:
        ctx.fillStyle = grd1;
        ctx.fill();
        break;
    case 3:
        ctx.fillStyle = grd1;
        ctx.fill();
        break;
    case 5:
        ctx.fillStyle = grd2;
        ctx.fill();
        break;
    }

    //Vértices do quadrado
    ctx.beginPath();
    [x, y] = mapToViewport(...getVertex(5));
    ctx.fillStyle = 'white';
    ctx.arc(x, y, 3, 0, -angulo * Math.PI);
    ctx.fill();

    ctx.closePath();

    ctx.beginPath();
    [x, y] = mapToViewport(...getVertex(1));
    ctx.fillStyle = 'green';
    ctx.arc(x, y, 3, 0, -angulo * Math.PI);
    ctx.fill();

    ctx.closePath();

    ctx.beginPath();
    [x, y] = mapToViewport(...getVertex(2));
    ctx.fillStyle = 'blue';
    ctx.arc(x, y, 3, 0, -angulo * Math.PI);
    ctx.fill();

    ctx.closePath();

    ctx.beginPath();
    [x, y] = mapToViewport(...getVertex(3));
    ctx.fillStyle = 'red';
    ctx.arc(x, y, 3, 0, -angulo * Math.PI);
    ctx.fill();

    ctx.closePath();
}

/**
  * <p>Entry point when page is loaded.</p>
  *
  * Basically this function does setup that "should" only have to be done once,<br>
  * while draw() does things that have to be repeated each time the canvas is
  * redrawn.
  */
function mainEntrance() {
    // retrieve <canvas> element
    var canvasElement = document.querySelector("#theCanvas");
    var ctx = canvasElement.getContext("2d");
    let vertice = 3;
    w = canvasElement.width;
    h = canvasElement.height;

    document.addEventListener("keydown", (event) => {
        console.log(event.key);
        
        switch (event.key) {
        case "g":
            vertice = 1;
            break;
        case "b":
            vertice = 2;
            break;
        case "r":
            vertice = 3;
            break;
        case "w":
            vertice = 5;
            break;
        }
    });
    /**
      * A closure to set up an animation loop in which the
      * scale grows by "increment" each frame.
      * @global
      * @function
      */
    var runanimation = (() => {
        //taxa de quantos graus por frames o quadrado  vai girar
        var angulo = 2.0
        
        return () => {
            
            draw(ctx, angulo, vertice);

            // request that the browser calls runanimation() again "as soon as it can"
            requestAnimationFrame(runanimation);
        };
    })();

    // draw!
    runanimation();
}