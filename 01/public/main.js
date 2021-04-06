const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl){
	throw new Error('WebGL not supported');
}

/* 
 *vertexData = [...]
 * create buffer on the gpu
 * load vertexData into buffer
 * create vertex shader
 * create fragment shader
 * create program
 * attach shader to program
 * 
 * enable vertex attributes 
 * draw
 * */

const vertexData = [0, 1, 0,
					1, -1, 0,
					-1,-1,0,];//x, y, z coordinates for each row (3 vertices)
					
const buffer = gl.createBuffer();//we create the buffer
gl.bindBuffer(gl.ARRAY_BUFFER,buffer);// we bind it and we say is an array to contain an array of vertices
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);// the third value indicates how often we expect to rewrite the content of the buffer (static no rewrite)
// the option is STATIC_DRAW or DYNAMIC_DRAW

const vertexShader = gl.createShader(gl.VERTEX_SHADER);//we specify the type (the shader is a mini program and run on the gpu)
gl.shaderSource(vertexShader,'attribute vec3 position;void main(){gl_Position = vec4(position,1);}');
// we load the data from buffer to vertex shader in position and we then convert in to a vector of 4 components
// gl_position is the output of the vertex shader,(array of 4 component that come from buffer into vertex shader

gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader,'void main(){gl_FragColor = vec4(1,0,0,1);}');
//color rgb and opacity
gl.compileShader(fragmentShader);
const program = gl.createProgram();
gl.attachShader(program,vertexShader);
gl.attachShader(program,fragmentShader);
gl.linkProgram(program);//ties everything togheter

// we must enable the attributes(coordinates, color, ...) the attributes you have are stored in the vertex shader (position) 

const positionLocation = gl.getAttribLocation(program,"position");

gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation,3,gl.FLOAT,false,0,0);//how it should retrieve the attribute data
//last attributes: normalization(to optimize, stride and offset)

gl.useProgram(program);//create an executable on the gpu
gl.drawArrays(gl.TRIANGLES,0,3);//the draw mode a lot of modes, then we have the starting vertex, then how many vertex should be drawn
