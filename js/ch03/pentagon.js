"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;
var direction = 1;
var speed = 50;

function changeDir(){
	direction *= -1;
}

function initRotSquare(){
	canvas = document.getElementById( "rot-canvas" );
	gl = WebGLUtils.setupWebGL( canvas);
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	gl.viewport( 5, 6, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	var program = initShaders( gl, "rot-v-shader", "rot-f-shader" );
	gl.useProgram( program );

	var vertices = [
		//  0,  1,  0,
		// -1,  0,  0,
		//  1,  0,  0,
		//  0, -1,  0

        // -0.6,  0.4,  0,
		// -0.4,  -1,  0,
        //  0,   1,   0,
		//  0.4,  -1,  0,
		//  0.6, 0.4,  0,
        //  0,   1,   0
         
        //  -0.3,  0.2,  0,
        //  -0.2,  -0.5,  0,
        //   0,   0.5,   0,
        //   0.2, -0.5,  0,
        //   0.3, 0.2,  0


        //五边形1
        -0.2, 0.8,  0,
        -0.1, 0.2,  0,
         0,   1.0,   0,
         0.1, 0.2,  0,
         0.2, 0.8,  0,
        //五边形2
        -0.2,-0.8,  0,
        -0.1,-0.2,   0,
         0.0,-1.0,  0,
         0.1,-0.2,  0,
         0.2,-0.8,   0,
        //矩形
        -0.8,-0.005, 0,
        -0.8, 0.005, 0,
         0.8,-0.005, 0,
         0.8, 0.005, 0

	];

    var vertcolors = [
        //五边形1
        // 100/255.0 ,168/255.0,178/255.0 ,1.0,
        // 100/255.0 ,168/255.0,178/255.0 ,1.0,
        // 100/255.0 ,168/255.0,178/255.0 ,1.0,
        // 100/255.0 ,168/255.0,178/255.0 ,1.0,
        // 100/255.0 ,168/255.0,178/255.0 ,1.0,
        // // 100/255.0 ,168/255.0,178/255.0 ,1.0,
        // //五边形2
        // 30/255.0 ,122/255.0,154/255.0 ,1.0,
        // 30/255.0 ,122/255.0,154/255.0 ,1.0,
        // 30/255.0 ,122/255.0,154/255.0 ,1.0,
        // 30/255.0 ,122/255.0,154/255.0 ,1.0,
        // 30/255.0 ,122/255.0,154/255.0 ,1.0,
        // // 30/255.0 ,122/255.0,154/255.0 ,1.0,
        // //矩形
        // 186/255.0 ,203/255.0 ,233/255.0, 1.0,
        // 186/255.0 ,203/255.0 ,233/255.0, 1.0,
        // 186/255.0 ,203/255.0 ,233/255.0, 1.0,
        // 186/255.0 ,203/255.0 ,233/255.0, 1.0
        // // 186/255.0 ,203/255.0 ,233/255.0,

        100/255 ,168/255,178/255 ,1.0,
        100/255 ,168/255,178/255 ,1.0,
        100/255 ,168/255,178/255 ,1.0,
        100/255 ,168/255,178/255 ,1.0,
        100/255 ,168/255,178/255 ,1.0,
        // 100/255.0 ,168/255.0,178/255.0 ,1.0,
        //五边形2
        30/255 ,122/255,154/255 ,1.0,
        30/255 ,122/255,154/255 ,1.0,
        30/255 ,122/255,154/255 ,1.0,
        30/255 ,122/255,154/255 ,1.0,
        30/255 ,122/255,154/255 ,1.0,
        // 30/255.0 ,122/255.0,154/255.0 ,1.0,
        //矩形
        186/255 ,203/255 ,233/255, 1.0,
        186/255 ,203/255 ,233/255, 1.0,
        186/255 ,203/255 ,233/255, 1.0,
        186/255 ,203/255 ,233/255, 1.0,

	];

   

	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	thetaLoc = gl.getUniformLocation( program, "theta" );

    var cbufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, cbufferId );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertcolors ), gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vColor );

	document.getElementById( "speedcon" ).onchange = function( event ){
		speed = 100 - event.target.value;
	}

	renderSquare();
}

function renderSquare(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	
	// set uniform values
	theta += direction * 0.1;
	
	gl.uniform1f( thetaLoc, theta );

	gl.drawArrays( gl.TRIANGLE_STRIP, 0, 5 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 5, 5 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 10, 4 );
    

	// update and render
	setTimeout( function(){ requestAnimFrame( renderSquare ); }, speed );
}

//button 暂停
function stopRot(){
	speed = 100000;
}

//button 开始
function startRot(){
	speed = 50;
}

