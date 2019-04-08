class Coordenada {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function EquacaoDaReta(x, x1, y1, x2, y2) {
    var coeficiente = (y2 - y1) / (x2 - x1);
    return (coeficiente * (x - x1)) + y1;
}

function Norma(x1, y1, x2, y2) {
    var deltaX = Math.abs(x2 - x1);
    var deltaY = Math.abs(y2 - y1);
    return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
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

class Ponto {
    constructor(context) {
        this.context = context;
    }

    adicionaPonto(x, y) {
        this.ponto = new Coordenada(x, y);
    }

    draw() {
        this.context.fillRect(this.ponto.x, this.ponto.y, 2, 2);
    }
}

class Reta {
    constructor(context) {
        this.pontos = [];
        this.context = context;
    }

    adicionaPonto(x, y) {
        this.pontos.push(new Coordenada(x, y));
    }

    draw(objetos) {
        this.context.fillStyle = "#000000";
        this.context.strokeStyle = "#000000";

        this.context.beginPath();
        this.context.moveTo(this.pontos[0].x, this.pontos[0].y);
        this.context.lineTo(this.pontos[1].x, this.pontos[1].y);
        this.context.stroke();

        this.context.fillStyle = "#FF0000";
        this.context.strokeStyle = "#FF0000";

        this.context.fillRect(this.pontos[0].x - 1.5, this.pontos[0].y - 1.5, 3, 3);

        this.context.fillStyle = "#008000";
        this.context.fillRect(this.pontos[1].x - 1.5, this.pontos[1].y - 1.5, 3, 3);

        this.context.fillStyle = "#000000";

        var i;

        for (i = 0; i < objetos.length; i++) {
            if (objetos[i] instanceof Reta) {
                var reta = objetos[i];

                if (reta.pontos[0].x == this.pontos[0].x
                    && reta.pontos[0].y == this.pontos[0].y
                    && reta.pontos[1].x == this.pontos[1].x
                    && reta.pontos[1].y == this.pontos[1].y) {
                    break;
                }

                var b1 = EquacaoDaReta(0, reta.pontos[0].x, reta.pontos[0].y, reta.pontos[1].x, reta.pontos[1].y);
                var b2 = EquacaoDaReta(0, this.pontos[0].x, this.pontos[0].y, this.pontos[1].x, this.pontos[1].y);

                var m1 = (reta.pontos[1].y - reta.pontos[0].y) / (reta.pontos[1].x - reta.pontos[0].x);
                var m2 = (this.pontos[1].y - this.pontos[0].y) / (this.pontos[1].x - this.pontos[0].x);

                var x = (b2 - b1) / (m1 - m2);
                var y = m1 * x + b1;

                var menorYReta = Math.min(reta.pontos[0].y, reta.pontos[1].y);
                var maiorYReta = Math.max(reta.pontos[0].y, reta.pontos[1].y);
                var menorXReta = Math.min(reta.pontos[0].x, reta.pontos[1].x);
                var maiorXReta = Math.max(reta.pontos[0].x, reta.pontos[1].x);

                var menorYThis = Math.min(this.pontos[0].y, this.pontos[1].y);
                var maiorYThis = Math.max(this.pontos[0].y, this.pontos[1].y);
                var menorXThis = Math.min(this.pontos[0].x, this.pontos[1].x);
                var maiorXThis = Math.max(this.pontos[0].x, this.pontos[1].x);

                if (y > menorYReta && y < maiorYReta && x > menorXReta && x < maiorXReta
                    && y > menorYThis && y < maiorYThis && x > menorXThis && x < maiorXThis) {
                    this.context.fillStyle = "#FF0000";
                    this.context.strokeStyle = "#FF0000";

                    this.context.fillRect(x - 1.5, y - 1.5, 3, 3);

                    this.context.fillStyle = "#000000";
                    this.context.strokeStyle = "#000000";

                    var produtoInterno = ProdutoInterno(reta.pontos, this.pontos);
                    var normaReta = Norma(reta.pontos[0].x, reta.pontos[0].y, reta.pontos[1].x, reta.pontos[1].y);
                    var normaThis = Norma(this.pontos[0].x, this.pontos[0].y, this.pontos[1].x, this.pontos[1].y);

                    var arccos = Math.acos(((produtoInterno) / (normaReta * normaThis)));

                    this.context.beginPath();
                    //y = EquacaoDaReta(x, this.pontos[0].x, this.pontos[0].y, this.pontos[1].x, this.pontos[1].y);
                    this.context.arc(x, y, 15, Math.atan2(this.pontos[1].y - this.pontos[0].y, this.pontos[1].x - this.pontos[0].x), 0);
                    console.log(RadianoParaGrau(Math.atan2(this.pontos[1].y - this.pontos[0].y, this.pontos[1].x - this.pontos[0].x)));
                    this.context.stroke();

                    var anguloEmGrau = RadianoParaGrau(arccos);

                    //x += Math.cos(angulo2) * 15;
                    //y = m2 * x + b2;

                    this.context.font = "12px Arial";
                    this.context.fillText(anguloEmGrau.toFixed(0), x, y);

                    this.context.fillStyle = "#000000";
                }
            }
        }
    }

    drawPreview(x, y) {
        this.context.strokeStyle = "#000000";

        this.context.beginPath();
        this.context.moveTo(this.pontos[0].x, this.pontos[0].y);
        this.context.lineTo(x, y);
        this.context.stroke();
    }
}

class Poligono {
    constructor(context) {
        this.pontos = [];
        this.context = context;
    }

    adicionaPonto(x, y) {
        this.pontos.push(new Coordenada(x, y));
    }

    draw() {
        this.context.beginPath();
        this.context.moveTo(this.pontos[0].x, this.pontos[0].y);

        var i;

        for (i = 1; i < this.pontos.length; i++) {
            this.context.lineTo(this.pontos[i].x, this.pontos[i].y);
        }

        this.context.closePath(); //Conecta primeiro ponto com o último

        context.fill();
    }

    drawPreview(x, y) {
        this.context.beginPath();
        this.context.moveTo(this.pontos[0].x, this.pontos[0].y);

        var i;

        for (i = 1; i < Object.keys(this.pontos).length; i++) {
            this.context.lineTo(this.pontos[i].x, this.pontos[i].y);
        }

        this.context.lineTo(x, y);

        this.context.closePath(); //Conecta primeiro ponto com o último



        this.context.stroke();
    }
}

class Circulo {
    constructor(context) {
        this.pontos = [];
        this.raio = 0;
        this.context = context;
    }

    adicionaPonto(x, y) {
        this.pontos.push(new Coordenada(x, y));
    }

    draw() {
        this.context.beginPath();
        this.raio = Norma(this.pontos[0].x, this.pontos[0].y, this.pontos[1].x, this.pontos[1].y);
        this.context.arc(this.pontos[0].x, this.pontos[0].y, this.raio, 0, 2 * Math.PI);
        this.context.fill();
    }

    drawPreview(x, y) {
        this.context.beginPath();
        this.raio = Norma(this.pontos[0].x, this.pontos[0].y, x, y);
        this.context.arc(this.pontos[0].x, this.pontos[0].y, this.raio, 0, 2 * Math.PI);
        this.context.stroke();
    }
}

class CurvaDeBezier {
    constructor(context) {
        this.pontos = [];
        this.context = context;
    }

    adicionaPonto(x, y) {
        this.pontos.push(new Coordenada(x, y));
    }

    draw() {
        this.context.beginPath();
        this.context.moveTo(this.pontos[0].x, this.pontos[0].y);
        this.context.bezierCurveTo(this.pontos[1].x, this.pontos[1].y, this.pontos[2].x, this.pontos[2].y, this.pontos[3].x, this.pontos[3].y);
        this.context.stroke();
    }

    drawPreview(x, y) {
        if (Object.keys(this.pontos).length == 3) {
            this.context.beginPath();
            this.context.moveTo(this.pontos[0].x, this.pontos[0].y);
            this.context.bezierCurveTo(this.pontos[1].x, this.pontos[1].y, this.pontos[2].x, this.pontos[2].y, x, y);
            this.context.stroke();
        }
    }
}