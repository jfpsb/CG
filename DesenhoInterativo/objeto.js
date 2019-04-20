class Coordenada {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.z = 0;
    }
}

function EquacaoDaReta(x, x1, y1, x2, y2) {
    return (((x - x1) * (y2 - y1)) / (x2 - x1)) + y1;
}

function EquacaoDaReta2(y, x1, y1, x2, y2) {
    return (((x2 - x1) * (y - y1)) / (y2 - y1)) + x1;
}

function Norma(x1, y1, x2, y2) {
    var deltaX = Math.abs(x2 - x1);
    var deltaY = Math.abs(y2 - y1);
    return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
}

function Norma2(x, y, z) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
}

function ProdutoInterno(reta, atual) {
    var deltaX1 = reta[1].x - reta[0].x;
    var deltaX2 = atual[1].x - atual[0].x;
    var deltaY1 = reta[1].y - reta[0].y;
    var deltaY2 = atual[1].y - atual[0].y;
    return (deltaX1 * deltaX2) + (deltaY1 * deltaY2);
}

function RadianoParaGrau(radianos) {
    return (180 * radianos) / Math.PI;
}

function GrauParaRadiano(graus) {
    return (Math.PI * graus) / 180;
}

function Translacao(x, y, pontoTransformacao, pontos, pontos2) {
    var deltaTranslacao = new Coordenada(x - pontoTransformacao.x, y - pontoTransformacao.y);
    var i;

    for (i = 0; i < Object.keys(pontos).length; i++) {
        pontos[i].x = pontos2[i].x + deltaTranslacao.x;
        pontos[i].y = pontos2[i].y + deltaTranslacao.y;
    }
}

function Escalamento(x, y, pontoTransformacao, pontos, pontos2) {
    var quocienteEscalamento = new Coordenada(x / pontoTransformacao.x, y / pontoTransformacao.y);

    var i;

    for (i = 0; i < Object.keys(pontos).length; i++) {
        var offsetX = (pontos2[i].x - pontoTransformacao.x) * quocienteEscalamento.x;
        var offsetY = (pontos2[i].y - pontoTransformacao.y) * quocienteEscalamento.y;

        pontos[i].x = offsetX + pontoTransformacao.x;
        pontos[i].y = offsetY + pontoTransformacao.y;
    }
}

class Objeto {
    constructor(context) {
        this.context = context;
        this.cor = "#000000";
        this.corBorda = "#FFFFFF";
        this.pontos = [];
        this.pontos2 = [];
        this.deltaTranslacao = null;
    }

    adicionaPonto(x, y) {
        this.pontos.push(new Coordenada(x, y));
        this.pontos2.push(new Coordenada(x, y));
    }

    draw() {
        this.context.fillStyle = this.cor;
        this.context.strokeStyle = this.cor;
    }

    drawPreview() {
        this.context.strokeStyle = "#000000";
    }

    drawSelection() {
        this.context.fillStyle = "rgba(0, 0, 255, 0.4)"; //Azul
    }

    clicado(x, y) {
        console.log("Sobrescreva o m�todo na subclasse!");
        return false;
    }

    area() {
        console.log("Esse objeto n�o calcula �rea!");
        return "undefined";
    }

    iniciaTransformacao() {
        //Argumentos s�o x e y
        if (arguments.length == 2) {
            var x = arguments[0];
            var y = arguments[1];

            this.pontoTransformacao = new Coordenada(x, y);
        }
        //Argumento � a reta que ser� usada no espelhamento
        else {
            this.retaTransformacao = arguments[0];
        }
    }

    executaTranslacao(x, y) {
        Translacao(x, y, this.pontoTransformacao, this.pontos, this.pontos2);
    }

    executaEscalamento(x, y) {
        Escalamento(x, y, this.pontoTransformacao, this.pontos, this.pontos2);
    }

    finalizaTransformacao() {
        this.pontos2 = JSON.parse(JSON.stringify(this.pontos)); //copia novos pontos
    }
}

class Ponto extends Objeto {
    draw() {
        super.draw();
        this.context.fillRect(this.pontos[0].x, this.pontos[0].y, 2, 2);
    }

    clicado(x, y) {
        var TOL = 2;
        var xmin = this.pontos[0].x, xmax = this.pontos[0].x + TOL, ymin = this.pontos[0].y, ymax = this.pontos[0].y + TOL;

        if (x >= xmin && x <= xmax && y >= ymin && y <= ymax) {
            return true;
        }

        return false;
    }
}

class Reta extends Objeto {
    draw(objetos) {
        super.draw();

        //Desenho linha em canvas
        this.context.beginPath();
        this.context.moveTo(this.pontos[0].x, this.pontos[0].y);
        this.context.lineTo(this.pontos[1].x, this.pontos[1].y);
        this.context.stroke();

        //Desenho um ponto vermelho para indicar o come�o da linha
        this.context.fillStyle = "#FF0000";
        this.context.strokeStyle = "#FF0000";
        this.context.fillRect(this.pontos[0].x - 1.5, this.pontos[0].y - 1.5, 3, 3);

        //Desenho um ponto verde para indicar o fim da linha
        this.context.fillStyle = "#008000";
        this.context.fillRect(this.pontos[1].x - 1.5, this.pontos[1].y - 1.5, 3, 3);

        var i;

        //Teste, c�lculo e desenho de interse��o entre linhas
        for (i = 0; i < objetos.length; i++) {
            if (objetos[i] instanceof Reta) {
                var linhaDesenhada = objetos[i];

                //Se a linha j� desenhada estiver exatamente na mesma posi��o da linha sendo desenhada
                if (linhaDesenhada.pontos[0].x == this.pontos[0].x
                    && linhaDesenhada.pontos[0].y == this.pontos[0].y
                    && linhaDesenhada.pontos[1].x == this.pontos[1].x
                    && linhaDesenhada.pontos[1].y == this.pontos[1].y) {
                    break;
                }

                var b1 = EquacaoDaReta(0, linhaDesenhada.pontos[0].x, linhaDesenhada.pontos[0].y, linhaDesenhada.pontos[1].x, linhaDesenhada.pontos[1].y);
                var b2 = EquacaoDaReta(0, this.pontos[0].x, this.pontos[0].y, this.pontos[1].x, this.pontos[1].y);

                //Coeficiente angular da linha j� desenhada
                var m1 = (linhaDesenhada.pontos[1].y - linhaDesenhada.pontos[0].y) / (linhaDesenhada.pontos[1].x - linhaDesenhada.pontos[0].x);
                //Coeficiente angular da linha sendo desenhada
                var m2 = (this.pontos[1].y - this.pontos[0].y) / (this.pontos[1].x - this.pontos[0].x);

                var x = (b2 - b1) / (m1 - m2);
                var y = m1 * x + b1; //Equa��o reduzida da reta

                //Coordenadas das "caixas" das linhas
                var menorYReta = Math.min(linhaDesenhada.pontos[0].y, linhaDesenhada.pontos[1].y);
                var maiorYReta = Math.max(linhaDesenhada.pontos[0].y, linhaDesenhada.pontos[1].y);
                var menorXReta = Math.min(linhaDesenhada.pontos[0].x, linhaDesenhada.pontos[1].x);
                var maiorXReta = Math.max(linhaDesenhada.pontos[0].x, linhaDesenhada.pontos[1].x);

                var menorYThis = Math.min(this.pontos[0].y, this.pontos[1].y);
                var maiorYThis = Math.max(this.pontos[0].y, this.pontos[1].y);
                var menorXThis = Math.min(this.pontos[0].x, this.pontos[1].x);
                var maiorXThis = Math.max(this.pontos[0].x, this.pontos[1].x);

                //Somente desenho �ngulo se a interse��o estiver no espa�o das caixas das retas
                if (y >= menorYReta && y < maiorYReta && x >= menorXReta && x < maiorXReta
                    && y >= menorYThis && y < maiorYThis && x >= menorXThis && x < maiorXThis) {

                    //Desenha ponto vermelho na interse��o das linhas
                    this.context.fillStyle = "#FF0000";
                    this.context.strokeStyle = "#FF0000";
                    this.context.fillRect(x - 1.5, y - 1.5, 3, 3);

                    this.context.fillStyle = "#000000";
                    this.context.strokeStyle = "#000000";

                    var produtoInterno = ProdutoInterno(linhaDesenhada.pontos, this.pontos);
                    var normaReta = Norma(linhaDesenhada.pontos[0].x, linhaDesenhada.pontos[0].y, linhaDesenhada.pontos[1].x, linhaDesenhada.pontos[1].y);
                    var normaThis = Norma(this.pontos[0].x, this.pontos[0].y, this.pontos[1].x, this.pontos[1].y);

                    //Tamanho do arco entre uma linha e outra
                    var arccos = Math.acos(((produtoInterno) / (normaReta * normaThis)));
                    //�ngulo em radianos da reta j� desenhada at� o eixo x
                    var arctanreta = Math.atan2(linhaDesenhada.pontos[1].y - linhaDesenhada.pontos[0].y, linhaDesenhada.pontos[1].x - linhaDesenhada.pontos[0].x);
                    //�ngulo em radianos da reta sendo desenhada at� o eixo x
                    var arctanthis = Math.atan2(this.pontos[1].y - this.pontos[0].y, this.pontos[1].x - this.pontos[0].x);

                    this.drawArco(x, y, arctanreta, arctanthis);

                    var anguloEmGrau = RadianoParaGrau(arccos);

                    this.context.font = "12px Arial";
                    this.context.fillText(anguloEmGrau.toFixed(0), x + 5, y);
                }
            }
        }
    }

    drawPreview(x, y) {
        super.drawPreview();
        this.context.beginPath();
        this.context.moveTo(this.pontos[0].x, this.pontos[0].y);
        this.context.lineTo(x, y);
        this.context.stroke();
    }

    drawArco(x, y, arctanreta, arctanthis) {
        var angarctanreta = RadianoParaGrau(arctanreta);
        var angarctanthis = RadianoParaGrau(arctanthis);
        var sentidoHorario;
        var radius = 20;

        this.context.strokeStyle = "#FF0000";

        this.context.beginPath();

        //Se linha j� desenhada estiver no 1� quadrante
        if (angarctanreta > -90 && angarctanreta < 0) {
            //Se linha sendo desenhada estiver no 3� ou 4� quadrantes
            if (angarctanthis > 0) {
                var anguloSuplementar = 180 - Math.abs(angarctanreta);
                if (angarctanthis <= anguloSuplementar) {
                    sentidoHorario = false;
                }
                else {
                    sentidoHorario = true;
                }
            }
            //Se as duas linhas estiverem no 1� ou 2� quadrantes
            else {
                //Se reta j� desenhada estiver � esquerda
                if (angarctanreta < angarctanthis) {
                    //Desenha da reta j� desenhada em sentido hor�rio
                    sentidoHorario = false;
                }
                else {
                    //Desenha da reta j� desenhada em sentido anti hor�rio
                    sentidoHorario = true;
                }
            }
        }
        //Se linha j� desenhada estiver no 2� quadrante
        else if (angarctanreta < -90 && angarctanreta > -180) {
            //Se linha sendo desenhada estiver no 3� ou 4� quadrantes
            if (angarctanthis > 0) {
                var anguloSuplementar = 180 - Math.abs(angarctanreta);
                if (angarctanthis <= anguloSuplementar) {
                    sentidoHorario = false;
                }
                else {
                    sentidoHorario = true;
                }
            }
            //Se as duas linhas estiverem no 1� ou 2� quadrantes
            else {
                //Se reta j� desenhada estiver � esquerda
                if (angarctanreta < angarctanthis) {
                    //Desenha a partir da reta j� desenhada em sentido hor�rio
                    sentidoHorario = false;
                }
                else {
                    //Desenha da reta j� desenhada em sentido anti hor�rio
                    sentidoHorario = true;
                }
            }
        }
        //Se linha j� desenhada estiver no 3� quadrante
        else if (angarctanreta > 90 && angarctanreta < 180) {
            //Se linha sendo desenhada estiver no 1� ou 2� quadrantes
            if (angarctanthis < 0) {
                var anguloSuplementar = (180 - angarctanreta) * (-1);
                if (angarctanthis <= anguloSuplementar) {
                    sentidoHorario = false;
                }
                else {
                    sentidoHorario = true;
                }
            }
            //Se as duas linhas estiverem no 3� ou 4� quadrantes
            else {
                //Se �ngulo da reta j� desenhada em rela��o ao eixo x for maior que da nova linha
                if (angarctanreta > angarctanthis) {
                    //Desenha a partir da reta j� desenhada em sentido anti hor�rio
                    sentidoHorario = true;
                }
                else {
                    //Desenha da reta j� desenhada em sentido hor�rio
                    sentidoHorario = false;
                }
            }
        }
        //Se linha j� desenhada estiver no 4� quadrante
        else if (angarctanreta > 0 && angarctanreta < 90) {
            //Se linha sendo desenhada estiver no 1� ou 2� quadrantes
            if (angarctanthis < 0) {
                var anguloSuplementar = (180 - angarctanreta) * (-1);
                if (angarctanthis <= anguloSuplementar) {
                    sentidoHorario = false;
                }
                else {
                    sentidoHorario = true;
                }
            }
            //Se as duas linhas estiverem no 3� ou 4� quadrantes
            else {
                //Se �ngulo da linha j� desenhada em rela��o ao eixo x for maior que da nova linha
                if (angarctanreta > angarctanthis) {
                    //Desenha a partir da reta j� desenhada em sentido anti hor�rio
                    sentidoHorario = true;
                }
                else {
                    //Desenha da reta j� desenhada em sentido anti hor�rio
                    sentidoHorario = false;
                }
            }
        }

        this.context.arc(x, y, radius, arctanreta, arctanthis, sentidoHorario);
        this.context.stroke();
    }

    clicado(x, y) {
        var TOL = 3 / 2; //A �rea total de toler�ncia s�o 3 pixels, mas o centro dela fica a 1,5 pixel de cada lado
        var xmin = x - TOL, xmax = x + TOL, ymin = y - TOL, ymax = y + TOL;
        var x0 = this.pontos[0].x, y0 = this.pontos[0].y, x1 = this.pontos[1].x, y1 = this.pontos[1].y;
        var i;

        var flags1 = this.pickCode(x1, y1, xmin, xmax, ymin, ymax);

        do {
            var flags0 = this.pickCode(x0, y0, xmin, xmax, ymin, ymax);

            for (i = 0; i < 4; i++) {
                if (flags0[i] && flags1[i]) {
                    break;
                }
            }

            if (i != 4) {
                break;
            }

            if (flags0[0]) {
                y0 += (xmin - x0) * (y1 - y0) / (x1 - x0);
                x0 = xmin;
            }
            else if (flags0[1]) {
                y0 += (xmax - x0) * (y1 - y0) / (x1 - x0);
                x0 = xmax;
            }
            else if (flags0[2]) {
                x0 += (ymax - y0) * (x1 - x0) / (y1 - y0);
                y0 = ymin;
            }
            else if (flags0[3]) {
                x0 += (ymax - y0) * (x1 - x0) / (y1 - y0);
                y0 = ymax;
            }
            else {
                return true;
            }
        } while (true);

        return false;
    }

    pickCode(x, y, xmin, xmax, ymin, ymax) {
        var flags = [];

        flags[0] = x < xmin; //esquerda
        flags[1] = x > xmax; //direita
        flags[2] = y > ymax //embaixo
        flags[3] = y < ymin; //acima

        return flags;
    }
}

class Poligono extends Objeto {
    draw() {
        super.draw();

        this.context.beginPath();
        this.context.moveTo(this.pontos[0].x, this.pontos[0].y);

        var i;

        for (i = 1; i < this.pontos.length; i++) {
            this.context.lineTo(this.pontos[i].x, this.pontos[i].y);
        }

        this.context.closePath(); //Conecta primeiro ponto com o �ltimo

        context.fill();

        this.context.strokeStyle = this.corBorda;
        this.context.stroke();
    }

    drawPreview(x, y) {
        super.drawPreview();

        this.context.beginPath();
        this.context.moveTo(this.pontos[0].x, this.pontos[0].y);

        var i;

        for (i = 1; i < Object.keys(this.pontos).length; i++) {
            this.context.lineTo(this.pontos[i].x, this.pontos[i].y);
        }

        this.context.lineTo(x, y);

        this.context.closePath(); //Conecta primeiro ponto com o �ltimo

        this.context.stroke();
    }

    drawSelection() {
        super.drawSelection();

        this.context.beginPath();
        this.context.moveTo(this.pontos[0].x, this.pontos[0].y);

        var i;

        for (i = 1; i < this.pontos.length; i++) {
            this.context.lineTo(this.pontos[i].x, this.pontos[i].y);
        }

        this.context.closePath(); //Conecta primeiro ponto com o �ltimo

        context.fill();

        this.context.strokeStyle = this.corBorda;
        this.context.stroke();
    }

    area() {
        var determinantes = [];
        var normal = [];
        var i, j;

        var pontosSize = Object.keys(this.pontos).length;

        for (i = 0; i < pontosSize - 1; i++) {
            determinantes.push(this.determinante(this.pontos[i], this.pontos[i + 1]));
        }

        //�ltimo ponto com primeiro
        determinantes.push(this.determinante(this.pontos[pontosSize - 1], this.pontos[0]));

        for (i = 0; i < 3; i++) {
            var aux = 0;

            for (j = 0; j < Object.keys(determinantes).length; j++) {
                var d = determinantes[j];
                aux += d[i];
            }

            normal[i] = aux / 2;
        }

        return Norma2(normal[0], normal[1], normal[2]);
    }

    clicado(x, y) {
        var i, intersecao = 0;
        var pontosSize = Object.keys(this.pontos).length;

        for (i = 0; i < pontosSize - 1; i++) {
            intersecao += this.testaPontos(x, y, i, i + 1, intersecao);
        }

        intersecao += this.testaPontos(x, y, 0, pontosSize - 1, intersecao);

        if (intersecao % 2 == 0)
            return false;

        return true;
    }

    testaPontos(x, y, i, j) {
        var xmax = Math.max(this.pontos[i].x, this.pontos[j].x);
        var ymin = Math.min(this.pontos[i].y, this.pontos[j].y);
        var ymax = Math.max(this.pontos[i].y, this.pontos[j].y);
        var intersecao = 0;

        if ((y > ymax) || (y < ymin) || (x > xmax) || (this.pontos[i].y == this.pontos[j].y)) {
            return 0;
        }

        if (this.pontos[i].y == y) {
            if ((this.pontos[i].x > x) && (this.pontos[j].y > y)) {
                intersecao++;
            }
        }
        else if (this.pontos[j].y == y) {
            if ((this.pontos[j].x > x) && (this.pontos[i].y > y)) {
                intersecao++;
            }
        }
        else if ((this.pontos[i].x > x) && (this.pontos[j].x > x)) {
            intersecao++;
        }
        else {
            var xi = EquacaoDaReta2(y, this.pontos[i].x, this.pontos[i].y, this.pontos[j].x, this.pontos[j].y);

            if (xi > x) {
                intersecao++;
            }
        }

        return intersecao;
    }

    determinante(ponto1, ponto2) {
        var vetorResultante = [];

        var i1 = ponto1.y * ponto2.z;
        var i2 = ponto2.y * ponto1.z;
        var j1 = ponto1.z * ponto2.x;
        var j2 = ponto2.z * ponto1.x;
        var k1 = ponto1.x * ponto2.y;
        var k2 = ponto2.x * ponto1.y;

        vetorResultante[0] = i1 - i2;
        vetorResultante[1] = j1 - j2;
        vetorResultante[2] = k1 - k2;

        return vetorResultante;
    }
}

class Circulo extends Objeto {
    constructor(context, raio, cor, corBorda) {
        super(context);

        if (raio !== undefined) {
            this.raioFixo = true;
            this.raio = raio;
            this.cor = cor;
            this.corBorda = corBorda;
        }
    }

    draw() {
        super.draw();

        this.context.beginPath();

        if (!(typeof this.raio === 'undefined')) {
            this.raio = Norma(this.pontos[0].x, this.pontos[0].y, this.pontos[1].x, this.pontos[1].y);
            //Coloco o raio da circufer�ncia simbolizado como uma linha horizontal
            //Ajuda no escalamento
            this.pontos[1].x = this.pontos[0].x + this.raio;
            this.pontos[1].y = this.pontos[0].y;
        }

        this.context.arc(this.pontos[0].x, this.pontos[0].y, this.raio, 0, 2 * Math.PI);
        this.context.fill();

        this.context.strokeStyle = this.corBorda;
        this.context.stroke();
    }

    drawPreview(x, y) {
        super.drawPreview();

        this.context.beginPath();
        this.raio = Norma(this.pontos[0].x, this.pontos[0].y, x, y);
        this.context.arc(this.pontos[0].x, this.pontos[0].y, this.raio, 0, 2 * Math.PI);
        this.context.stroke();
    }

    drawSelection() {
        super.drawSelection();

        this.context.beginPath();
        this.raio = Norma(this.pontos[0].x, this.pontos[0].y, this.pontos[1].x, this.pontos[1].y);
        this.context.arc(this.pontos[0].x, this.pontos[0].y, this.raio, 0, 2 * Math.PI);
        this.context.fill();

        this.context.strokeStyle = this.corBorda;
        this.context.stroke();
    }

    clicado(x, y) {
        var distanciaAteCentro = Norma(this.pontos[0].x, this.pontos[0].y, x, y);

        if (distanciaAteCentro > this.raio) {
            return false;
        }

        return true;
    }

    area() {
        return (Math.PI * (Math.pow(this.raio, 2))).toFixed(2);
    }

    executaEscalamento(x, y) {
        var quocienteEscalamento = new Coordenada(x / this.pontoTransformacao.x, y / this.pontoTransformacao.y);

        var offsetX = (this.pontos2[1].x - this.pontoTransformacao.x) * quocienteEscalamento.x;
        var offsetY = (this.pontos2[1].y - this.pontoTransformacao.y) * quocienteEscalamento.y;

        this.pontos[1].x = offsetX + this.pontoTransformacao.x;
        this.pontos[1].y = offsetY + this.pontoTransformacao.y;
    }
}

class CurvaDeBezier extends Objeto {
    draw() {
        super.draw();
        this.context.beginPath();
        this.context.moveTo(this.pontos[0].x, this.pontos[0].y);
        this.context.bezierCurveTo(this.pontos[1].x, this.pontos[1].y, this.pontos[2].x, this.pontos[2].y, this.pontos[3].x, this.pontos[3].y);
        this.context.stroke();
    }

    drawPreview(x, y) {
        super.drawPreview();

        if (Object.keys(this.pontos).length == 3) {
            this.context.beginPath();
            this.context.moveTo(this.pontos[0].x, this.pontos[0].y);
            this.context.bezierCurveTo(this.pontos[1].x, this.pontos[1].y, this.pontos[2].x, this.pontos[2].y, x, y);
            this.context.stroke();
        }
    }

    clicado(x, y) {
        var t, TOL = 2;
        var curvaXMin = Math.min(this.pontos[0].x, this.pontos[2].x, this.pontos[2].x, this.pontos[3].x)
        var curvaXMax = Math.max(this.pontos[0].x, this.pontos[2].x, this.pontos[2].x, this.pontos[3].x)

        var xmin = x - TOL, xmax = x + TOL, ymin = y - TOL, ymax = y + TOL;

        for (t = 0; t <= 1; t += (1 / (curvaXMax - curvaXMin))) {
            var xi = this.EquacaoX(t);
            var yi = this.EquacaoY(t);

            if (xi >= xmin && xi <= xmax && yi >= ymin && yi <= ymax) {
                return true;
            }
        }

        return false;
    }

    EquacaoX(t) {
        return (Math.pow((1 - t), 3) * this.pontos[0].x) + (3 * Math.pow((1 - t), 2) * t * this.pontos[1].x) + (3 * (1 - t) * Math.pow(t, 2) * this.pontos[2].x) + (Math.pow(t, 3) * this.pontos[3].x);
    }

    EquacaoY(t) {
        return (Math.pow((1 - t), 3) * this.pontos[0].y) + (3 * Math.pow((1 - t), 2) * t * this.pontos[1].y) + (3 * (1 - t) * Math.pow(t, 2) * this.pontos[2].y) + (Math.pow(t, 3) * this.pontos[3].y);
    }
}