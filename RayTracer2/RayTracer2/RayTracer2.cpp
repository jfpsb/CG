#define _USE_MATH_DEFINES
#include <cmath>	
#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <stdlib.h>
#include <iomanip>
#include <algorithm>

#define INFINITY INT_MAX

using namespace std;

class Vetor3 {
public:
	double x, y, z;

	Vetor3() {
		x = y = z = 0;
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

	Vetor3 operator - (Vetor3 v) {
		return Vetor3(x - v.x, y - v.y, z - v.z);
	}

	Vetor3 operator * (double d) {
		return Vetor3(x * d, y * d, z * d);
	}

	//Produto Vetorial
	Vetor3 operator * (Vetor3 v) {
		return Vetor3((y * v.z) - (v.y * z), (z * v.x) - (v.z * x), (x * v.y) - (v.x * y));
	}

	double produtoEscalar(Vetor3 v) {
		return (x * v.x) + (y * v.y) + (z * v.z);
	}

	double norma() {
		return sqrt(x * x + y * y + z * z);
	}

	Vetor3 normalizar() {
		double n = norma();
		return Vetor3(x / n, y / n, z / n);
	}

	double angulo(Vetor3 v) {
		double cos = produtoEscalar(v) / (norma() * v.norma());
		double ang = acos(cos);
		ang *= (180 / M_PI);
		return ang;
	}
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
	vector<Vetor3> textures;
};

class Raio {
public:
	Vetor3 o, d;

	Raio(Vetor3 origem, Vetor3 direcao) {
		o = origem;
		d = direcao;
	}
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

			if (splitted[0] == "vt") {
				mesh.textures.push_back(Vetor3(atof(splitted[1].c_str()), atof(splitted[2].c_str()), 0));
			}

			if (splitted[0] == "f") {
				Face face;

				for (int i = 1; i < splitted.size(); i++) {
					vector<string> splitf = split(splitted[i], '/');

					int v_index = atoi(splitf[0].c_str()) - 1, t_index, n_index;
					face.vertices.push_back(mesh.vertices[v_index]);

					if (splitf.size() >= 2) {
						if (!splitf[1].empty()) {
							t_index = atoi(splitf[1].c_str()) - 1;
							face.vtexturas.push_back(mesh.textures[t_index]);
						}
					}

					if (splitf.size() == 3) {
						n_index = atoi(splitf[2].c_str()) - 1;
						face.vnormals.push_back(mesh.normals[n_index]);
					}
				}

				mesh.faces.push_back(face);
			}
		}

		if (mesh.normals.size() == 0) {

		}
	}
	else {
		cout << "Não Abriu" << endl;
	}

	return mesh;
}

ostream& operator << (ostream& o, Vetor3 v) {
	return o << std::setprecision(9) << v.x << " " << v.y << " " << v.z << endl;
}

void clamp255(Vetor3& col) {
	col.x = (col.x > 255) ? 255 : (col.x < 0) ? 0 : col.x;
	col.y = (col.y > 255) ? 255 : (col.y < 0) ? 0 : col.y;
	col.z = (col.z > 255) ? 255 : (col.z < 0) ? 0 : col.z;
}

int main(int argc, char** argv) {

	Mesh mesh = loadFromObj("LowPolyTree.obj");

	cout << "O modelo possui " << mesh.vertices.size() << " vértices e " << mesh.faces.size() << " faces." << endl;
	cout << "Aguarde" << endl;

	double colunas = 180;
	double linhas = 320;

	Vetor3 COP(0, 1, -3);

	double xmin = -1;
	double ymin = -1;
	double xmax = 1;
	double ymax = 2;

	double width = (xmax - xmin) / colunas;
	double height = (ymax - ymin) / linhas;

	// Save result to a PPM image (keep these flags if you compile under Windows)
	std::ofstream ofs("./out.ppm", std::ios::out | std::ios::binary);
	ofs << "P3\n" << colunas << " " << linhas << " 255\n";

	for (double i = 0; i < linhas; i++) {
		for (double j = 0; j < colunas; j++) {
			double tNear = INFINITY;
			double x = xmin + (width * (j + 0.5));
			double y = ymax - (height * (i + 0.5));
			Vetor3 N2, ponto;

			Raio raio(COP, (Vetor3(x, y, -1) - COP).normalizar());

			for (Face face : mesh.faces) {
				Vetor3 v1v0 = face.vertices[1] - face.vertices[0];
				Vetor3 v2v0 = face.vertices[2] - face.vertices[0];

				//Normal do plano
				Vetor3 N = (v1v0 * v2v0).normalizar();

				//Produto escalar entre normal do plano e direcao
				double NdotP = N.produtoEscalar(raio.d);

				if (NdotP == 0)
					continue;

				// Achando d através da normal e um vértice do plano
				double d = N.produtoEscalar(face.vertices[0]);

				// Encontrando t (distância de COP até interseção)
				double t = (d - N.produtoEscalar(raio.o)) / NdotP;
				
				if (t < 0) continue; // Se a face estiver atrás de COP, não a fazer

				Vetor3 P(raio.o.x + t * raio.d.x, raio.o.y + t * raio.d.y, raio.o.z + t * raio.d.z);

				// Soma dos ângulos de cada vértice usando o ponto de interseção como origem
				// 359º ou 360º confirmam que ponto está dentro da superfície
				int v_size = face.vertices.size();
				double ang = 0;

				for (int i = 0; i < v_size; i++) {
					int i_next = (i + 1) % v_size;

					Vetor3 v1 = face.vertices[i] - P;
					Vetor3 v2 = face.vertices[i_next] - P;

					ang += v1.angulo(v2);
				}

				if (fabs(ang - 360) <= 1) {
					if (t < tNear) {
						tNear = t;
						N2 = N;
						ponto = P;
					}
				}
			}

			// Se ponto está fora, imprimir preto na imagem
			if (tNear == INFINITY) {
				ofs << "0" << " 0 " << "0" << endl;
			}
			else { // Cálculo de cor do pixel
				Vetor3 L = ponto - Vetor3(1, 1, 3); // Direção da luz ao ponto
				Vetor3 E = raio.o - ponto; // Direção de COP até o ponto de interseção
				Vetor3 H = L - E;
				int I = 200;
				int red = 0;
				int green = 0.3 * I + I * (0.3 * (N2.produtoEscalar(L.normalizar())) + 1 * pow(N2.produtoEscalar(H.normalizar()), 4));
				int blue = 0;

				ofs << red << ' '
					<< green << ' '
					<< blue << '\n';
			}
		}
	}

	ofs.close();

	cout << "DONE" << endl;

	return 0;
}