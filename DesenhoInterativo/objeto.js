class Coordenada {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
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

    draw() {
        this.context.beginPath();
        this.context.moveTo(this.pontos[0].x, this.pontos[0].y);
        this.context.lineTo(this.pontos[1].x, this.pontos[1].y);
        this.context.stroke();
    }

    drawPreview(x, y) {
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
        this.raio = Math.sqrt(Math.pow(this.pontos[1].x - this.pontos[0].x, 2) + Math.pow(this.pontos[1].y - this.pontos[0].y, 2));
        this.context.arc(this.pontos[0].x, this.pontos[0].y, this.raio, 0, 2 * Math.PI);
        this.context.fill();
    }

    drawPreview(x, y) {
        this.context.beginPath();
        this.raio = Math.sqrt(Math.pow(x - this.pontos[0].x, 2) + Math.pow(y - this.pontos[0].y, 2));
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