var vertexShaderString;
var fragmentShaderString;

function randomColor(){
	return [Math.random(), Math.random(), Math.random()];
}

function gestisciResponse1(e) {
    if (e.target.readyState == 4 && e.target.status == 200) {
		vertexShaderString = e.target.responseText;
		var httpRequest2 = new XMLHttpRequest();
		httpRequest2.onreadystatechange = gestisciResponse2;
		httpRequest2.open("GET", "/fragment_shader.txt", true);
		httpRequest2.send();
    }
}
function gestisciResponse2(e) {
    if (e.target.readyState == 4 && e.target.status == 200) {
		fragmentShaderString = e.target.responseText;
		main();
    }
}
        
document.addEventListener("DOMContentLoaded", function() {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = gestisciResponse1;
  httpRequest.open("GET", "/vertex_shader.txt", true);
  httpRequest.send();
});

function main(){

	const canvas = document.querySelector('canvas');
	const gl = canvas.getContext('webgl');




	if (!gl){
		throw new Error('WebGL not supported');
	}

	/*
	const matrix = [
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		x,y,z,1
	];
	*/
	//matrix * [2,3,4,1] the coordinates will be translated by 10 (* must be replaced by a function)

	//const matrix = glMatrix.mat4.create();//is the matrix like one before and is stored in a flat array
	// matrix is a reference to the mat4 object created
	
	//let result = glMatrix.mat4.create();
	//glMatrix.mat4.translate(result,matrix,[2,5,1]);
	// equivalente a fare
	/*
	 * let result = mat4.translate(mat4.create(),matrix,[2,5,1]);
	 * */

	//glMatrix.mat4.translate(matrix,matrix,[2,5,1]);
	//glMatrix.mat4.translate(matrix,matrix,[-1,-3,0]);

	const vertexData = [
		// Front
		0.5, 0.5, 0.5,
		0.5, -.5, 0.5,
		-.5, 0.5, 0.5,
		-.5, 0.5, 0.5,
		0.5, -.5, 0.5,
		-.5, -.5, 0.5,

		// Left
		-.5, 0.5, 0.5,
		-.5, -.5, 0.5,
		-.5, 0.5, -.5,
		-.5, 0.5, -.5,
		-.5, -.5, 0.5,
		-.5, -.5, -.5,

		// Back
		-.5, 0.5, -.5,
		-.5, -.5, -.5,
		0.5, 0.5, -.5,
		0.5, 0.5, -.5,
		-.5, -.5, -.5,
		0.5, -.5, -.5,

		// Right
		0.5, 0.5, -.5,
		0.5, -.5, -.5,
		0.5, 0.5, 0.5,
		0.5, 0.5, 0.5,
		0.5, -.5, 0.5,
		0.5, -.5, -.5,

		// Top
		0.5, 0.5, 0.5,
		0.5, 0.5, -.5,
		-.5, 0.5, 0.5,
		-.5, 0.5, 0.5,
		0.5, 0.5, -.5,
		-.5, 0.5, -.5,

		// Bottom
		0.5, -.5, 0.5,
		0.5, -.5, -.5,
		-.5, -.5, 0.5,
		-.5, -.5, 0.5,
		0.5, -.5, -.5,
		-.5, -.5, -.5,
	];//x, y, z coordinates for each row (3 vertices)

	//const colorData = [ ...randomColor(),//v1.color
	//					...randomColor(),//v2.color
	//					...randomColor()];//v3.color
	
	let colorData = [];
	for(let face = 0; face < 6; face++){
		let faceColor = randomColor();
		for(let vertex = 0; vertex < 6; vertex++){
			colorData.push(...faceColor);
		}
	}
	
	const positionBuffer = gl.createBuffer();//we create the buffer
	gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);// we bind it and we say is an array to contain an array of vertices
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);// the third value indicates how often we expect to rewrite the content of the buffer (static no rewrite)
	const colorBuffer = gl.createBuffer();//we create the buffer
	gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer);// we bind it and we say is an array to contain an array of vertices
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);// the third value indicates how often we expect to rewrite the content of the buffer (static no rewrite)

	// the option is STATIC_DRAW or DYNAMIC_DRAW

	const vertexShader = gl.createShader(gl.VERTEX_SHADER);//we specify the type (the shader is a mini program and run on the gpu)
	gl.shaderSource(vertexShader,vertexShaderString);
	// we load the data from buffer to vertex shader in position and we then convert in to a vector of 4 components
	// gl_position is the output of the vertex shader,(array of 4 component that come from buffer into vertex shader

	gl.compileShader(vertexShader);

	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader,fragmentShaderString);
	//color rgb and opacity
	gl.compileShader(fragmentShader);
	const program = gl.createProgram();
	gl.attachShader(program,vertexShader);
	gl.attachShader(program,fragmentShader);
	gl.linkProgram(program);//ties everything togheter

	// we must enable the attributes(coordinates, color, ...) the attributes you have are stored in the vertex shader (position) 

	const positionLocation = gl.getAttribLocation(program,"position");

	gl.enableVertexAttribArray(positionLocation);
	gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);// we must say which is the default buffer he must look at
	gl.vertexAttribPointer(positionLocation,3,gl.FLOAT,false,0,0);//how it should retrieve the attribute data
	//last attributes: normalization(to optimize, stride and offset)

	const colorLocation = gl.getAttribLocation(program,"color");


	gl.enableVertexAttribArray(colorLocation);
	gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer);// we must say which is the default buffer he must look at
	gl.vertexAttribPointer(colorLocation,3,gl.FLOAT,false,0,0);//how it should retrieve the attribute data
	//last attributes: normalization(to optimize, stride and offset)

	gl.useProgram(program);//create an executable on the gpu
	gl.enable(gl.DEPTH_TEST);// when 2 vertices passes on each other, the one closer to the camera take presence
	const uniformLocations = {
		matrix:gl.getUniformLocation(program,'matrix'),
	};
	
	
	const matrix = glMatrix.mat4.create();
	glMatrix.mat4.translate(matrix,matrix,[.2,.5,.1]);
	glMatrix.mat4.scale(matrix,matrix,[0.25,0.25,0.25]);//scale is a vecrtor of 3 components
	
	
	
	
	function animate(){
		requestAnimationFrame(animate);
		glMatrix.mat4.rotateZ(matrix,matrix,Math.PI/2 / 70);
		glMatrix.mat4.rotateX(matrix,matrix,Math.PI/2 / 70);
		gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
		gl.drawArrays(gl.TRIANGLES,0,vertexData.length / 3);//the draw mode a lot of modes, then we have the starting vertex, then how many vertex should be drawn

	}
	
	animate();
}
