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
        this.pontos.push(new Coordenada(x, y));
    }

    draw() {
        context.fillRect(this.pontos[0].x, this.pontos[0].y, 3, 3);
    }
}

class Reta {
    pontos = [];

    constructor(context) {
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
}

class Poligono {
    constructor(context, x, y) {

    }
}