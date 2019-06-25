#version 330 core
layout (location = 0) in vec4 vPosition;
layout (location = 1) in vec4 vColor;

out vec4 color;
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
uniform mat4 oblique;

void main() {
	gl_Position = projection * view * oblique * model * vPosition;
	color = vColor;
}