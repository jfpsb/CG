#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include <iostream>
#define _USE_MATH_DEFINES
#include <math.h>

#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>

void framebuffer_size_callback(GLFWwindow* window, int width, int height);
void processInput(GLFWwindow* window);
void key_callback(GLFWwindow* window, int key, int scancode, int action, int mods);

const char* vertexShaderSource = "#version 330 core\n"
"layout (location = 0) in vec4 vPosition;\n"
"layout (location = 1) in vec4 vColor;\n"
"out vec4 color;\n"
"uniform mat4 model;\n"
"uniform mat4 view;\n"
"uniform mat4 projection;\n"
"uniform mat4 oblique;\n"
"void main()\n"
"{\n"
"gl_Position = projection * view * oblique * model * vPosition;\n"
"color = vColor;\n"
"}\0";
const char* fragmentShaderSource = "#version 330 core\n"
"in  vec4 color;\n"
"void main()\n"
"{\n"
"   gl_FragColor = color;\n"
"}\0";

#define PERSPECTIVA 1
#define ORTOGONAL 2
#define OBLIQUO 3

const float W_WIDTH = 800;
const float W_HEIGHT = 800;

int projecao = PERSPECTIVA;
int rodar = 0;
int estadoAntigo = GLFW_PRESS;

int main()
{
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
	//glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);

	GLFWwindow* window = glfwCreateWindow(W_WIDTH, W_HEIGHT, "Computacao Grafica", NULL, NULL);
	if (window == NULL)
	{
		std::cout << "Failed to create GLFW window" << std::endl;
		glfwTerminate();
		return -1;
	}

	glfwSetKeyCallback(window, key_callback);

	glfwMakeContextCurrent(window);

	if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
	{
		std::cout << "Failed to initialize GLAD" << std::endl;
		return -1;
	}

	glEnable(GL_DEPTH_TEST);

	glViewport(0, 0, 800, 600);
	glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);

	// build and compile our shader program
	// ------------------------------------
	// vertex shader
	int vertexShader = glCreateShader(GL_VERTEX_SHADER);
	glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
	glCompileShader(vertexShader);

	// check for shader compile errors
	int success;
	char infoLog[512];
	glGetShaderiv(vertexShader, GL_COMPILE_STATUS, &success);
	if (!success)
	{
		glGetShaderInfoLog(vertexShader, 512, NULL, infoLog);
		std::cout << "ERROR::SHADER::VERTEX::COMPILATION_FAILED\n" << infoLog << std::endl;
	}
	// fragment shader
	int fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
	glShaderSource(fragmentShader, 1, &fragmentShaderSource, NULL);
	glCompileShader(fragmentShader);
	// check for shader compile errors
	glGetShaderiv(fragmentShader, GL_COMPILE_STATUS, &success);
	if (!success)
	{
		glGetShaderInfoLog(fragmentShader, 512, NULL, infoLog);
		std::cout << "ERROR::SHADER::FRAGMENT::COMPILATION_FAILED\n" << infoLog << std::endl;
	}

	// link shaders
	int shaderProgram = glCreateProgram();
	glAttachShader(shaderProgram, vertexShader);
	glAttachShader(shaderProgram, fragmentShader);
	glLinkProgram(shaderProgram);

	// check for linking errors
	glGetProgramiv(shaderProgram, GL_LINK_STATUS, &success);
	if (!success) {
		glGetProgramInfoLog(shaderProgram, 512, NULL, infoLog);
		std::cout << "ERROR::SHADER::PROGRAM::LINKING_FAILED\n" << infoLog << std::endl;
	}
	glDeleteShader(vertexShader);
	glDeleteShader(fragmentShader);

	// set up vertex data (and buffer(s)) and configure vertex attributes
	// ------------------------------------------------------------------
	float vertices[] = {
		 1.0f,  1.0f,  1.0f, 1.0f,
		 1.0f, -1.0f,  1.0f, 1.0f,
		-1.0f, -1.0f,  1.0f, 1.0f,
		-1.0f,  1.0f,  1.0f, 1.0f,
		 1.0f,  1.0f, -1.0f, 1.0f,
		 1.0f, -1.0f, -1.0f, 1.0f,
		-1.0f,  1.0f, -1.0f, 1.0f,
		-1.0f, -1.0f, -1.0f, 1.0f
	};
	unsigned int indices[] = {
		0, 1, 3,
		1, 2, 3,
		4, 5, 0,
		5, 1, 0,
		6, 7, 4,
		7, 5, 4,
		3, 2, 6,
		2, 7, 6,
		4, 0, 6,
		0, 3, 6,
		5, 1, 7,
		1, 2, 7
	};

	float cores[] = {
		0.0f, 0.0f, 0.0f, 1.0f, // preto
		1.0f, 0.0f, 0.0f, 1.0f, // vermelho
		0.0f, 1.0f, 0.0f, 1.0f, // verde
		0.0f, 0.0f, 1.0f, 1.0f, // azul
		0.3f, 0.0f, 0.5f, 1.0f, // roxo
		1.0f, 1.0f, 1.0f, 1.0f, // branco
		1.0f, 1.0f, 0.0f, 1.0f, // amarelo
		1.0f, 0.2f, 0.0f, 1.0f  // laranja
	};


	unsigned int VBO, VAO, EBO;
	glGenVertexArrays(1, &VAO);
	glGenBuffers(1, &VBO);
	glGenBuffers(1, &EBO);

	// bind the Vertex Array Object first, then bind and set vertex buffer(s), and then configure vertex attributes(s).
	glBindVertexArray(VAO);

	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices) + sizeof(cores), NULL, GL_STATIC_DRAW);

	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
	glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);

	glBufferSubData(GL_ARRAY_BUFFER, 0, sizeof(vertices), vertices);
	glBufferSubData(GL_ARRAY_BUFFER, sizeof(vertices), sizeof(cores), cores);

	glEnableVertexAttribArray(0);
	glVertexAttribPointer(0, 4, GL_FLOAT, GL_FALSE, 4 * sizeof(float), (void*)0);

	glEnableVertexAttribArray(1);
	glVertexAttribPointer(1, 4, GL_FLOAT, GL_FALSE, 4 * sizeof(float), (void*)sizeof(vertices));

	// note that this is allowed, the call to glVertexAttribPointer registered VBO as the vertex attribute's bound vertex buffer object so afterwards we can safely unbind
	glBindBuffer(GL_ARRAY_BUFFER, 0);

	// You can unbind the VAO afterwards so other VAO calls won't accidentally modify this VAO, but this rarely happens. Modifying other
	// VAOs requires a call to glBindVertexArray anyways so we generally don't unbind VAOs (nor VBOs) when it's not directly necessary.
	glBindVertexArray(0);

	while (!glfwWindowShouldClose(window))
	{
		processInput(window);

		glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

		// matrizes de transformacao
		glm::mat4 model = glm::mat4(1.0f);
		glm::mat4 view = glm::mat4(1.0f);
		glm::mat4 projection = glm::mat4(1.0f);
		glm::mat4 oblique = glm::mat4(1.0f);

		if (rodar == 1) {
			model = glm::rotate(model, (float)glfwGetTime() * glm::radians(25.0f), glm::vec3(0.0f, 1.0f, 0.0f));
		}

		view = glm::lookAt(glm::vec3(4.0f, 4.0f, 4.0f), glm::vec3(0.0, 0.0, 0.0), glm::vec3(0.0, 1.0, 0.0));

		if (projecao == PERSPECTIVA) {
			projection = glm::perspective(glm::radians(45.0f), (float)W_WIDTH / (float)W_HEIGHT, 0.1f, 100.0f);
		}
		else if(projecao == ORTOGONAL) {
			projection = glm::ortho(-2.0f, 2.0f, -2.0f, 2.0f, -4.0f, 10.0f);
		}
		else {
			view = glm::lookAt(glm::vec3(0.0f, 0.0f, 4.0f), glm::vec3(0.0, 0.0, 0.0), glm::vec3(0.0, 1.0, 0.0));
			projection = glm::ortho(-2.0f, 2.0f, -2.0f, 2.0f, -4.0f, 10.0f);
			oblique = glm::mat4(
				glm::vec4(1.0, 0.0, 0.0, 0.0),
				glm::vec4(0.0, 1.0, 0.0, 0.0),
				glm::vec4(-0.5, -0.5, 1.0, 0.0),
				glm::vec4(0.0, 0.0, 0.0, 1.0)
			);
		}

		// retrieve the matrix uniform locations
		unsigned int projectionLoc = glGetUniformLocation(shaderProgram, "projection");
		unsigned int modelLoc = glGetUniformLocation(shaderProgram, "model");
		unsigned int viewLoc = glGetUniformLocation(shaderProgram, "view");
		unsigned int obliqueLoc = glGetUniformLocation(shaderProgram, "oblique");

		// pass them to the shaders
		glUniformMatrix4fv(modelLoc, 1, GL_FALSE, glm::value_ptr(model));
		glUniformMatrix4fv(viewLoc, 1, GL_FALSE, &view[0][0]);
		glUniformMatrix4fv(obliqueLoc, 1, GL_FALSE, &oblique[0][0]);
		glUniformMatrix4fv(projectionLoc, 1, GL_FALSE, &projection[0][0]);

		glUseProgram(shaderProgram);
		glBindVertexArray(VAO);
		//glDrawArrays(GL_TRIANGLES, 0, 6); // Para desenhar triângulo sem BO
		glDrawElements(GL_TRIANGLES, 36, GL_UNSIGNED_INT, 0);

		glfwSwapBuffers(window);
		glfwPollEvents();
	}

	glDeleteVertexArrays(1, &VAO);
	glDeleteBuffers(1, &VBO);
	glDeleteBuffers(1, &EBO);

	glfwTerminate();

	return 0;
}

void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
	glViewport(0, 0, width, height);
}

void processInput(GLFWwindow* window)
{
	
}

void key_callback(GLFWwindow* window, int key, int scancode, int action, int mods)
{
	if(key == GLFW_KEY_ESCAPE && action == GLFW_PRESS)
		glfwSetWindowShouldClose(window, true);

	if (key == GLFW_KEY_F1 && action == GLFW_PRESS)
		projecao = PERSPECTIVA;

	if (key == GLFW_KEY_F2 && action == GLFW_PRESS)
		projecao = ORTOGONAL;

	if (key == GLFW_KEY_F3 && action == GLFW_PRESS)
		projecao = OBLIQUO;

	if (key == GLFW_KEY_R && action == GLFW_PRESS)
		rodar = rodar == 0 ? 1 : 0;
}