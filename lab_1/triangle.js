/**
 * Created by wjh on 2017/6/26.
 */
 
var canvas;
var gl;
 
function init(){
    canvas = document.getElementById("Rectangle");//获取canvas元素
    gl = WebGLUtils.setupWebGL(canvas);
    //判断浏览器是否支持webgl
    if(!gl){
        alert("您的浏览器不支持WebGL!")
    }
 
    //矩形的定点数组，共4个（x,y,r,g,b）
    var verticescolor = new Float32Array([
        -0.5,0.0, 0.0,1.0,0.0,
        0.0,-0.5, 0.0,0.0,1.0,//r,g,b,为颜色信息
        0.0,0.5, 1.0,0.0,0.0,
        0.5,0.0, 0.0,0.0,0.0
    ]);
 
    //顶点顺序索引
    var indexV = new Uint8Array([
        0,1,2,
        2,1,3
    ]);
 
    //设置窗口大小
    gl.viewport(0,0,canvas.width,canvas.height);
    gl.clearColor(0.0,0.0,0.0,1.0);
 
    //初始化着色器
    var program = initShaders(gl,"v-shader","f-shader");
    gl.useProgram(program);
 
    //创建缓存
    var tBuffer = gl.createBuffer()//为矩形顶点创建的缓存
    var iBuffer = gl.createBuffer();//为顶点索引创建的缓存
 
    gl.bindBuffer(gl.ARRAY_BUFFER,tBuffer);//绑定缓冲区
    gl.bufferData(gl.ARRAY_BUFFER,flatten(verticescolor),gl.STATIC_DRAW);//向缓冲区写入顶点数据
 
    //获取顶点着色器中attribute变量位置
    var a_Position = gl.getAttribLocation(program,"a_Position");
 
    var SIZE = verticescolor.BYTES_PER_ELEMENT;
    //建立a_Position与顶点着色器attribute变量“a_Position”的关联
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,SIZE*5,0);
    gl.enableVertexAttribArray(a_Position);
 
    var a_Color = gl.getAttribLocation(program,"a_Color");
    gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,SIZE*5,SIZE*2);
    gl.enableVertexAttribArray(a_Color);
 
    gl.bindBuffer(gl.ARRAY_BUFFER,iBuffer);//绑定缓冲区
    gl.bufferData(gl.ARRAY_BUFFER,flatten(indexV),gl.STATIC_DRAW);//向缓冲区写入索引数据
 
 
    render();//执行画图函数
}
 
function render(){
    gl.clear(gl.COLOR_BUFFER_BIT);//清除屏幕
  gl.drawArrays(gl.TRIANGLE_STRIP,0,4)//画三角形，两个三角形拼凑成一个矩形
 
}
window.onload = init;//window加载init函数，最终显示矩形