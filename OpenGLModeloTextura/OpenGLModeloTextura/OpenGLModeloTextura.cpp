#include <glad/glad.h>
#include <GLFW/glfw3.h>

#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>

#include <iostream>
#include <Camera.h>
#include "Shader.h"
#include "Model.h"

void framebuffer_size_callback(GLFWwindow* window, int width, int height);
void processInput(GLFWwindow* window, glm::mat4 &model, glm::mat4& view);

// Dimensões
const unsigned int SCR_WIDTH = 1200;
const unsigned int SCR_HEIGHT = 800;

float camera_pos = 5.0f;

int main()
{
	// glfw: initialize and configure
	// ------------------------------
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	// glfw window creation
	// --------------------
	GLFWwindow* window = glfwCreateWindow(SCR_WIDTH, SCR_HEIGHT, "LearnOpenGL", NULL, NULL);
	if (window == NULL)
	{
		std::cout << "Failed to create GLFW window" << std::endl;
		glfwTerminate();
		return -1;
	}
	glfwMakeContextCurrent(window);
	glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);

	// tell GLFW to capture our mouse
	glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);

	// glad: load all OpenGL function pointers
	// ---------------------------------------
	if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
	{
		std::cout << "Failed to initialize GLAD" << std::endl;
		return -1;
	}

	// configure global opengl state
	// -----------------------------
	glEnable(GL_DEPTH_TEST);

	// build and compile shaders
	// -------------------------
	Shader ourShader("vshader31.glsl", "fshader31.glsl");

	// load models
	// -----------
	Model ourModel("King George V/King_George_V.obj");
	//"C:/Users/jfpsb/Downloads/Compressed/LearnOpenGL-master/resources/objects/cyborg/cyborg.obj"
	//"King George V/King_George_V.obj"

	// lighting info
	// -------------
	glm::vec3 lightPos(0.0f, 1.0f, 1.0f);

	// draw in wireframe
	//glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);

	// render loop
	// -----------

	// Configurações iniciais de MVP. Somente model vai ser alterada no processInput
	glm::mat4 projection = glm::perspective(glm::radians(45.0f), (float)SCR_WIDTH / (float)SCR_HEIGHT, 0.1f, 100.0f);
	glm::mat4 view = glm::lookAt(glm::vec3(camera_pos, camera_pos, camera_pos), glm::vec3(0.0, 0.0, 0.0), glm::vec3(0.0, 1.0, 0.0));
	glm::mat4 model = glm::mat4(1.0f);
	
	// Rotaciona o modelo para ficar na direção z com proa no sentido z+
	model = glm::rotate(model, glm::radians(90.0f), glm::vec3(0.0f, 0.0f, 1.0f));
	model = glm::rotate(model, glm::radians(90.0f), glm::vec3(0.0f, 1.0f, 0.0f));

	while (!glfwWindowShouldClose(window))
	{
		// input
		// -----
		processInput(window, model, view);

		// render
		// ------
		glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

		// don't forget to enable shader before setting uniforms
		ourShader.use();

		ourShader.setMat4("projection", projection);
		ourShader.setMat4("view", view);
		ourShader.setMat4("model", model);
		ourShader.setVec3("viewPos", glm::vec3(1.0f));
		ourShader.setVec3("lightPos", lightPos);
		ourModel.Draw(ourShader);


		// glfw: swap buffers and poll IO events (keys pressed/released, mouse moved etc.)
		// -------------------------------------------------------------------------------
		glfwSwapBuffers(window);
		glfwPollEvents();
	}

	// glfw: terminate, clearing all previously allocated GLFW resources.
	// ------------------------------------------------------------------
	glfwTerminate();
	return 0;
}

// process all input: query GLFW whether relevant keys are pressed/released this frame and react accordingly
// ---------------------------------------------------------------------------------------------------------
void processInput(GLFWwindow* window, glm::mat4 &model, glm::mat4 &view)
{
	if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
		glfwSetWindowShouldClose(window, true);

	// Altera direção Y
	if (glfwGetKey(window, GLFW_KEY_W) == GLFW_PRESS) {
		model = glm::rotate(model, 0.1f * glm::radians(25.0f), glm::vec3(0.0f, 1.0f, 0.0f));
	}

	if (glfwGetKey(window, GLFW_KEY_S) == GLFW_PRESS) {
		model = glm::rotate(model, 0.1f * glm::radians(25.0f), glm::vec3(0.0f, -1.0f, 0.0f));
	}

	// Altera direção X
	if (glfwGetKey(window, GLFW_KEY_A) == GLFW_PRESS) {
		model = glm::rotate(model, 0.1f * glm::radians(25.0f), glm::vec3(-1.0f, 0.0f, 0.0f));
	}

	if (glfwGetKey(window, GLFW_KEY_D) == GLFW_PRESS) {
		model = glm::rotate(model, 0.1f * glm::radians(25.0f), glm::vec3(1.0f, 0.0f, 0.0f));
	}

	// Altera direção Z
	if (glfwGetKey(window, GLFW_KEY_LEFT) == GLFW_PRESS) {
		model = glm::rotate(model, 0.1f * glm::radians(25.0f), glm::vec3(0.0f, 0.0f, -1.0f));
	}

	if (glfwGetKey(window, GLFW_KEY_RIGHT) == GLFW_PRESS) {
		model = glm::rotate(model, 0.1f * glm::radians(25.0f), glm::vec3(0.0f, 0.0f, 1.0f));
	}

	// Zoom
	if (glfwGetKey(window, GLFW_KEY_UP) == GLFW_PRESS) {
		if (camera_pos > 0.5f) {
			camera_pos *= 0.99f;
			view = glm::lookAt(glm::vec3(camera_pos, camera_pos, camera_pos), glm::vec3(0.0, 0.0, 0.0), glm::vec3(0.0, 1.0, 0.0));
		}
	}

	if (glfwGetKey(window, GLFW_KEY_DOWN) == GLFW_PRESS) {
		if (camera_pos < 5.0f) {
			camera_pos *= 1.01f;
			view = glm::lookAt(glm::vec3(camera_pos, camera_pos, camera_pos), glm::vec3(0.0, 0.0, 0.0), glm::vec3(0.0, 1.0, 0.0));
		}
	}
}

// glfw: whenever the window size changed (by OS or user resize) this callback function executes
// ---------------------------------------------------------------------------------------------
void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
	// make sure the viewport matches the new window dimensions; note that width and 
	// height will be significantly larger than specified on retina displays.
	glViewport(0, 0, width, height);
}