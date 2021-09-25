"use strict";

var gl;
var points;

window.onload = function init(){
	var canvas = document.getElementById( "triangle-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	// Three Vertices
	var vertices = [
		// -1.0, -1.0, 
		//  0.0,  1.0, 
		//  1.0, -1.0, 
		 0.0, -1.0,
		 1.0, -1.0,
		 1.0,  1.0,
		 0.0, -1.0,
		 1.0,  1.0,
		 0.0,  1.0
		//  0.5, -0.5,
		//  0.0, 0.5,
		//  0.5, -0.5
        // -0.5,0.0, 0.0,1.0,0.0,
        // 0.0,-0.5, 0.0,0.0,1.0,//r,g,b,为颜色信息
        // 0.0,0.5, 1.0,0.0,0.0,
        // 0.5,0.0, 0.0,0.0,0.0

	];

    var indexV = new Uint8Array([
        0,1,2,
        2,1,3
    ]);


	// Configure WebGL
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	// Load shaders and initialize attribute buffers
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );

	// Load the data into the GPU
	var bufferId = gl.createBuffer();//为矩形顶点创建的缓存
    var iBuffer = gl.createBuffer();//为顶点索引创建的缓存

	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW ); 
    // gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW ); 

	// Associate external shader variables with data buffer获取顶点着色器中attribute变量位置
	var vPosition = gl.getAttribLocation( program, "vPosition" );

    // var SIZE = vertices.BYTES_PER_ELEMENT;

	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

    // var a_vPosition = gl.getAttribLocation(program,"a_vPosition");
    // gl.vertexAttribPointer(a_vPosition,3,gl.FLOAT,false,SIZE*5,SIZE*2);
    // gl.enableVertexAttribArray(a_Color);
 
    // gl.bindBuffer(gl.ARRAY_BUFFER,iBuffer);//绑定缓冲区
    // gl.bufferData(gl.ARRAY_BUFFER,flatten(indexV),gl.STATIC_DRAW);//向缓冲区写入索引数据


	render();
}

function render(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	// gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
	gl.drawArrays( gl.TRIANGLES, 0, 3 );
	gl.drawArrays( gl.TRIANGLE_FANS, 3, 6 );
}