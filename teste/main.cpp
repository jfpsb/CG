#define _USE_MATH_DEFINES
#include <cmath>
#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <stdlib.h>

using namespace std;

class Vetor3 {
public:
	double x, y, z;

	Vetor3() {
		x = INT_MAX;
		y = INT_MAX;
		z = INT_MAX;
	}

	Vetor3(double f) {
		x = f;
		y = f;
		z = f;
	}

	Vetor3(double a, double b, double c) {
		x = a;
		y = b;
		z = c;
	}

	Vetor3 operator + (Vetor3 v) {
		return Vetor3(x + v.x, y + v.y, z + v.z);
	}

	bool operator == (int i) {
		if (x == INT_MAX && y == INT_MAX && z == INT_MAX)
			return true;

		return false;
	}

	Vetor3 operator - (Vetor3 v) {
		return Vetor3(x - v.x, y - v.y, z - v.z);
	}

	Vetor3 operator * (Vetor3 v) {
		return Vetor3(x * v.x, y * v.y, z * v.z);
	}

	double produtoVetorial(Vetor3 v) {
		return (x * v.x) + (y * v.y) + (z * v.z);
	}

	double norma() {
		return sqrt((x * x) + (y * y) + (z * z));
	}

	Vetor3 normalizar() {
		double n = norma();
		return Vetor3(x / n, y / n, z / n);
	}

	double angulo(Vetor3 v) {
		double cos = produtoVetorial(v) / norma() * v.norma();
		double ang = acos(cos);

		ang = (ang * 180) / M_PI;

		return ang;
	}
};

class Vetor4 {
public:
	double x, y, z, w;
};

class Face {
public:
	vector<Vetor3> vertices;
	vector<Vetor3> vtexturas;
	vector<Vetor3> vnormals;
};

class Mesh {
public:
	vector<Face> faces;
	vector<Vetor3> vertices;
	vector<Vetor3> normals;
};

vector<string> split(string s, char delimeter) {
	int lastDelPos = 0;
	vector<string> splitted;

	for (int i = 0; i < s.size(); i++) {
		if (s[i] == delimeter) {
			splitted.push_back(s.substr(lastDelPos, i - lastDelPos));
			lastDelPos = i + 1;
		}

		if (i == s.size() - 1) {
			splitted.push_back(s.substr(lastDelPos, i - lastDelPos + 1));
		}
	}

	return splitted;
}

Mesh loadFromObj(string filepath) {
	Mesh mesh;

	ifstream modelo(filepath.c_str());

	if (modelo.is_open()) {
		string linha;

		while (getline(modelo, linha)) {
			vector<string> splitted = split(linha, ' ');
			if (splitted[0] == "v") {
				mesh.vertices.push_back(Vetor3(atof(splitted[1].c_str()), atof(splitted[2].c_str()), atof(splitted[3].c_str())));
			}

			if (splitted[0] == "vn") {
				mesh.normals.push_back(Vetor3(atof(splitted[1].c_str()), atof(splitted[2].c_str()), atof(splitted[3].c_str())));
			}

			if (splitted[0] == "f") {
				Face face;

				for (int i = 1; i < splitted.size(); i++) {
					vector<string> splitf = split(splitted[i], '/');

					face.vertices.push_back(atof(splitf[0].c_str()) - 1);
					//face.vtexturas.push_back(atof(splitf[1].c_str()) - 1);
					face.vnormals.push_back(atof(splitf[2].c_str()) - 1);
				}

				mesh.faces.push_back(face);
			}
		}
	}
	else {
		cout << "Não Abriu" << endl;
	}

	return mesh;
}

Vetor3 luzAmbiente(1);
int m = 10;

vector<double> rayTrace(Vetor3 COP, Vetor3 pixel, Mesh mesh) {
	Vetor3 raio = (pixel - COP).normalizar();
	Vetor3 normal_prox(INT_MAX);
	double z;

	for (Face face : mesh.faces) {
		Vetor3 normal_plano = face.vnormals[0];

		if (raio.produtoVetorial(normal_plano) != 0) {
			double k = normal_plano.produtoVetorial(face.vertices[0]);
			double t = (k - normal_plano.produtoVetorial(COP)) / (normal_plano.produtoVetorial(raio));

			Vetor3 p_plano(COP.x + t * raio.x, COP.y + t * raio.y, COP.z + t * raio.z);

			int vertices_lenght = face.vertices.size();
			double ang = 0;

			for (int i = 0; i < vertices_lenght; i++) {
				int i_next = (i + 1) % vertices_lenght;

				Vetor3 vet1 = face.vertices[i] - p_plano;
				Vetor3 vet2 = face.vertices[i_next] - p_plano;

				ang += vet1.angulo(vet2);
			}

			if (abs(360 - ang) < 2) {
				if (z == NULL) {
					z = p_plano.z;
					normal_prox = normal_plano;
				}
				else if (p_plano.z < z) {
					normal_prox = normal_plano;
				}
			}
		}
	}

	if (normal_prox == INT_MAX) {
		return vector<double>(0);
	}

	vector<double> ka_reflex;

	ka_reflex.push_back(0);
	ka_reflex.push_back(0.5);
	ka_reflex.push_back(0);

	Vetor3 vetDifusa = Vetor3(1, 1, -3).normalizar();
	normal_prox = normal_prox.normalizar();
	Vetor3 COP2 = COP.normalizar();

	double nvl = pow(2 * normal_prox.produtoVetorial(vetDifusa) * normal_prox.produtoVetorial(COP2) - COP2.produtoVetorial(vetDifusa), m);

	double normal_luz = normal_prox.produtoVetorial(vetDifusa);

	double blue = ka_reflex[0] * luzAmbiente.x * normal_luz + (luzAmbiente.x * nvl);
	double green = ka_reflex[1] * luzAmbiente.y * normal_luz + (luzAmbiente.y * nvl);
	double red = ka_reflex[2] * luzAmbiente.z * normal_luz + (luzAmbiente.z * nvl);

	vector<double> v;

	v.push_back(blue);
	v.push_back(green);
	v.push_back(red);

	return v;
}

int main(int argc, char** argv) {
	Mesh mesh = loadFromObj("LowPolyTree.obj");

	int colunas = 320;
	int linhas = 180;

	Vetor3 COP(0, 0, -3);

	int xmin = -1;
	int ymin = -1;
	int xmax = 1;
	int ymax = 2;

	int dist = -1;
	double width = (xmax - xmin) / colunas;
	double height = (ymax - ymin) / linhas;

	std::ofstream out("outplease.ppm");
	out << "P3\n" << colunas << ' ' << linhas << ' ' << "255\n";

	for (int i = 0; i < linhas; i++) {
		for (int j = 0; j < colunas; j++) {
			Vetor3 pixel(xmin + (width * (j + 0.5)), ymax - (height * (i + 0.5)), dist);
			vector<double> cores = rayTrace(COP, pixel, mesh);

			out << (int)cores[0] << ' '
				<< (int)cores[1] << ' '
				<< (int)cores[2] << '\n';
		}
	}

	return 0;
}
