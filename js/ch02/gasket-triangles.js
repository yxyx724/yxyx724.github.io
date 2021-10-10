"use strict";

const { vec3 } = glMatrix;

var canvas;
var gl;

var points = [];
var colors = [];
var triangleDimention = "2d";
var trianForm = "unwire";
var radius = 1.0;
var rotate = 0;
var sideRotate = false;

var numTimesToSubdivide = 4;



window.onload = function initTriangles(){
	canvas = document.getElementById( "gl-canvas" );
    var sierNum2d = document.getElementById("sierNum2d");
    var sierNum3d = document.getElementById("sierNum3d");
    var wire2d = document.getElementById("wire2d");
    var init2d = document.getElementById("init2d");

	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

    // configure webgl
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	// initialise data for Sierpinski gasket
    if(triangleDimention == "2d"){
        // if(rotate != 0 ){
        // if(trianForm == "wire"){
            var vertices = [
				radius * Math.cos(90 * Math.PI / 180.0) , radius * Math.sin(90 * Math.PI / 180.0),  0,
				radius * Math.cos(210 * Math.PI / 180.0), radius * Math.sin(210 * Math.PI / 180.0),  0,
				radius * Math.cos(-30 * Math.PI / 180.0), radius * Math.sin(-30 * Math.PI / 180.0),  0
            //     //radius=1  
            //     //0,1,0
            //     //-/3/2,,-1/2,0
            //     //-/3/2,-1/2,0
			// ];
            // var vertices = [
            //     (-1) * cos(rotate)+y * sin(rotate), -(-1) * sin(rotate)+y * cos(rotate) ,0,
            //     (0) * cos(rotate)+y * sin(rotate), -(-1) * sin(rotate)+y * cos(rotate) ,0
            //     (-1) * cos(rotate)+y * sin(rotate), -(-1) * sin(rotate)+y * cos(rotate) ,0]
            ];
        // }else{
             // first, initialise the corners of the gasket with three points.
            // var vertices = [
            //     -1, -1,  0,
            //     0,  1,  0,
            //     1, -1,  0
            // ]
        // }
       ;
       if(rotate != 0 ){
           if(!sideRotate){
                var u = vec3.fromValues( vertices[0]* Math.cos(rotate* Math.PI / 180.0)+vertices[1] * Math.sin(rotate* Math.PI / 180.0), -vertices[0]* Math.sin(rotate* Math.PI / 180.0)+vertices[1] * Math.cos(rotate* Math.PI / 180.0), vertices[2] );
                // var v = vec3.create();
                // vec3.set( v, 0, 1, 0 );
                var v = vec3.fromValues( vertices[3]* Math.cos(rotate* Math.PI / 180.0)+vertices[4] * Math.sin(rotate* Math.PI / 180.0), -vertices[3]* Math.sin(rotate* Math.PI / 180.0)+vertices[4] * Math.cos(rotate* Math.PI / 180.0), vertices[5] );
                // var w = vec3.create();
                // vec3.set( w, 1, -1, 0 );
                var w = vec3.fromValues( vertices[6]* Math.cos(rotate* Math.PI / 180.0)+vertices[7] * Math.sin(rotate* Math.PI / 180.0), -vertices[6]* Math.sin(rotate* Math.PI / 180.0)+vertices[7] * Math.cos(rotate* Math.PI / 180.0), vertices[8] );
           }else{
                d1 = Math.sqrt(vertices[0]*vertices[0] + vertices[1]*vertices[1]);
                var u = vec3.fromValues( vertices[0]* Math.cos( d1*rotate* Math.PI / 180.0)+vertices[1] * Math.sin(d1*rotate* Math.PI / 180.0), -vertices[0]* Math.sin(d1*rotate* Math.PI / 180.0)+vertices[1] * Math.cos(d1*rotate* Math.PI / 180.0), vertices[2] );
                // var v = vec3.create();
                // vec3.set( v, 0, 1, 0 );
                d2 = Math.sqrt(vertices[3]*vertices[3] + vertices[4]*vertices[4]);
                var v = vec3.fromValues( vertices[3]* Math.cos(d2*rotate* Math.PI / 180.0)+vertices[4] * Math.sin(d2*rotate* Math.PI / 180.0), -vertices[3]* Math.sin(d2*rotate* Math.PI / 180.0)+vertices[4] * Math.cos(d2*rotate* Math.PI / 180.0), vertices[5] );
                // var w = vec3.create();
                // vec3.set( w, 1, -1, 0 );
                d3 = Math.sqrt(vertices[6]*vertices[6] + vertices[7]*vertices[7]);
                var w = vec3.fromValues( vertices[6]* Math.cos(d3*rotate* Math.PI / 180.0)+vertices[7] * Math.sin(d3*rotate* Math.PI / 180.0), -vertices[6]* Math.sin(d3*rotate* Math.PI / 180.0)+vertices[7] * Math.cos(d3*rotate* Math.PI / 180.0), vertices[8] );
           }
           
        }else{
            // var u = vec3.create();
            // vec3.set( u, -1, -1, 0 );
            var u = vec3.fromValues( vertices[0], vertices[1], vertices[2] );
            // var v = vec3.create();
            // vec3.set( v, 0, 1, 0 );
            var v = vec3.fromValues( vertices[3], vertices[4], vertices[5] );
            // var w = vec3.create();
            // vec3.set( w, 1, -1, 0 );
            var w = vec3.fromValues( vertices[6], vertices[7], vertices[8] );
        }
        


        divideTriangle2d( u, v, w, numTimesToSubdivide );

        // // configure webgl
        // gl.viewport( 0, 0, canvas.width, canvas.height );
        // gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

        // load shaders and initialise attribute buffers
        var program = initShaders( gl, "vertex-shader-2d", "fragment-shader-2d" );
        gl.useProgram( program );

        // load data into gpu
        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( points ), gl.STATIC_DRAW );

        // associate out shader variables with data buffer
        var vPosition = gl.getAttribLocation( program, "vPosition" );
        gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );

        // renderTriangles();
        if(trianForm == "wire") renderWire();
		else render2d();
    }else{

        var vertices = [
            0.0000, 0.0000, -1.0000,
            0.0000, 0.9428, 0.3333,
            -0.8165, -0.4714, 0.3333,
            0.8165, -0.4714, 0.3333
        ];
    
        // var t = vec3.create();
        // vec3.set(t, vertices[0], vertices[1], vertices[2]);
        var t = vec3.fromValues( vertices[0], vertices[1], vertices[2] );
        // var u = vec3.create();
        // vec3.set(u, vertices[3], vertices[4], vertices[5]);
        var u = vec3.fromValues( vertices[3], vertices[4], vertices[5] );
        // var v = vec3.create();
        // vec3.set(v, vertices[6], vertices[7], vertices[8]);
        var v = vec3.fromValues( vertices[6], vertices[7], vertices[8] );
        // var w = vec3.create();
        // vec3.set(w, vertices[9], vertices[10], vertices[11]);
        var w = vec3.fromValues( vertices[9], vertices[10], vertices[11] );
    
        divideTetra3d(t, u, v, w, numTimesToSubdivide);
    
        // enable hidden-surface removal
        gl.enable(gl.DEPTH_TEST);
    
        // load shaders and initialize attribute buffers
        var program = initShaders(gl, "vertex-shader-3d", "fragment-shader-3d");
        gl.useProgram(program);
    
        // create buffer object, initialize it, and associate it with
        // attribute variables in vertex shader
    
        var vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    
        var vPosition = gl.getAttribLocation(program, "vPosition");
        gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
    
        var cBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    
        var vColor = gl.getAttribLocation(program, "vColor");
        gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);
    
        render3d();
    }

    //task a
    //https://jingyan.baidu.com/article/e52e3615ea5b5700c70c517c.html  radio交互
    sierNum2d.onclick = function choiceNum2d(){
        points = [];
        var temp = document.getElementsByName("sierNumb2d");
        // 选择 <input type="text" id="result">;
        for(var i=0;i<temp.length;i++){
			if(temp[i].checked){
				// alert("checked :" + temp[i].value);
				numTimesToSubdivide = temp[i].value;
			} 
		}
        triangleDimention="2d";
        trianForm = "unwire";
        
        initTriangles();
    }

    //task b
    sierNum3d.onclick = function choiceNum3d(){
        points = [];
        var temp = document.getElementsByName("sierNumb3d");
        // 选择 <input type="text" id="result">;
        for(var i=0;i<temp.length;i++){
			if(temp[i].checked){
				// alert("checked :" + temp[i].value);
				numTimesToSubdivide = temp[i].value;
			} 
		}
        triangleDimention="3d";
        trianForm = "unwire";
        initTriangles();
	}

    //task c
    // wire2d.onclick = function choiceNumWire(){
    //     points = [];
    //     var temp = document.getElementsByName("wire");
    //     // 选择 <input type="text" id="result">;
    //     for(var i=0;i<temp.length;i++){
	// 		if(temp[i].checked){
	// 			// alert("checked :" + temp[i].value);
	// 			numTimesToSubdivide = temp[i].value;
	// 		} 
	// 	}
    //     triangleDimention="2d";
    //     trianForm = "wire";
    //     initTriangles();
	// }

    //task d  & c  e
    wire2d.onclick = function choiceNumRotate(){
        points = [];

        var temp0 = document.getElementsByName("wire");
        // 选择 <input type="text" id="result">;
        for(var i=0;i<temp0.length;i++){
			if(temp0[i].checked){
				// alert("checked :" + temp[i].value);
				numTimesToSubdivide = temp0[i].value;
			} 
		}

        var temp = document.getElementsByName("rotate");
        // alert("checked :" + temp.value);
        // 选择 <input type="text" id="result">;
        for(var i=0;i<temp.length;i++){
			if(temp[i].checked){
				// alert("checked :" + temp[i].value);
				rotate = temp[i].value;
			} 
		}
        //
        var temp1 = document.getElementsByName("sizeRotate2d");
        // alert("checked :" + temp.value);
        // 选择 <input type="text" id="result">;
        for(var i=0;i<temp1.length;i++){
			if(temp1[i].checked){
				// alert("checked :" + temp[i].value);
				sideRotate = temp1[i].value;
			} 
		}
        triangleDimention="2d";
        trianForm = "wire";
        initTriangles();
	}

    init2d.onclick = function choiceNumWire(){
        points = [];

        //
        var temp = document.getElementsByName("wire");
        // 选择 <input type="text" id="result">;
        for(var i=0;i<temp.length;i++){
			if(temp[i].checked){
				// alert("checked :" + temp[i].value);
				numTimesToSubdivide = temp[i].value;
			} 
		}

        triangleDimention="2d";
        trianForm = "wire";
        rotate = 0;
        initTriangles();
	}


	
};

function triangle2d( a, b, c ){
	//var k;
	points.push(a[0], a[1], a[2]);
	if(trianForm == "wire")  points.push(b[0], b[1], b[2]);
	points.push(b[0], b[1], b[2]);
	if(trianForm == "wire") points.push(c[0], c[1], c[2]);
	points.push(c[0], c[1], c[2]);
	if(trianForm == "wire") points.push(a[0], a[1], a[2]);
    
	// if(trianForm == "wire") {
    //     points.push(b[0], b[1], b[2]);
    //     points.push(c[0], c[1], c[2]);
    //     points.push(a[0], a[1], a[2]);
    // // }else{
    //     points.push( a[0], a[1], a[2] );
	//     points.push( b[0], b[1], b[2] );
	//     points.push( c[0], c[1], c[2] );
    // }

	// for( k = 0; k < 3; k++ )
	// 	points.push( a[k] );
	// for( k = 0; k < 3; k++ )
	// 	points.push( b[k] );
	// for( k = 0; k < 3; k++ )
	// 	points.push( c[k] );



}

function tetra(a, b, c, d) {
    triangle3d(a, c, b, 0);
    triangle3d(a, c, d, 1);
    triangle3d(a, b, d, 2);
    triangle3d(b, c, d, 3);
}

function triangle3d(a, b, c, color) {
    // add colors and vertices for one triangle
    var baseColor = [
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 0.0
    ];

    for (var k = 0; k < 3; k++) {
        colors.push(baseColor[color * 3 + k]);
    }
    for (var k = 0; k < 3; k++)
        points.push(a[k]);

    for (var k = 0; k < 3; k++) {
        colors.push(baseColor[color * 3 + k]);
    }
    for (var k = 0; k < 3; k++)
        points.push(b[k]);

    for (var k = 0; k < 3; k++) {
        colors.push(baseColor[color * 3 + k]);
    }
    for (var k = 0; k < 3; k++)
        points.push(c[k]);
}


function divideTriangle2d( a, b, c, count ){
	// check for end of recursion
	if( count == 0 ){
		triangle2d( a, b, c );
        
	}else{
		var ab = vec3.create();
		vec3.lerp( ab, a, b, 0.5 );
		var bc = vec3.create();
		vec3.lerp( bc, b, c, 0.5 );
		var ca = vec3.create();
		vec3.lerp( ca, c, a, 0.5 );

		--count;

		// three new triangles
		divideTriangle2d( a, ab, ca, count );
		divideTriangle2d( b, bc, ab, count );
		divideTriangle2d( c, ca, bc, count );

        if(trianForm == "wire") divideTriangle2d(ab, ca, bc, count);
	}
}


function divideTetra3d(a, b, c, d, count) {
    // check for end of recursion
    if (count == 0) {
        tetra(a, b, c, d);
    } else {
        var ab = vec3.create();
        vec3.lerp(ab, a, b, 0.5);
        var ac = vec3.create();
        vec3.lerp(ac, a, c, 0.5);
        var ad = vec3.create();
        vec3.lerp(ad, a, d, 0.5);
        var bc = vec3.create();
        vec3.lerp(bc, b, c, 0.5);
        var bd = vec3.create();
        vec3.lerp(bd, b, d, 0.5);
        var cd = vec3.create();
        vec3.lerp(cd, c, d, 0.5);

        --count;

        divideTetra3d(a, ab, ac, ad, count);
        divideTetra3d(ab, b, bc, bd, count);
        divideTetra3d(ac, bc, c, cd, count);
        divideTetra3d(ad, bd, cd, d, count);
    }

}

function renderWire(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	gl.drawArrays( gl.LINES, 0, points.length/3 );
}

function render2d(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	gl.drawArrays( gl.TRIANGLES, 0, points.length/3 );
}

function render3d() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, points.length / 3);
}