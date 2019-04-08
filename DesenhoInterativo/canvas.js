var canvas = document.getElementById('canvas');

var context = canvas.getContext('2d');

const PONTO = 1;
const RETA = 2;
const POLIGONO = 3;
const CIRCULO = 4;
const BEZIER = 5;

var objeto;
objetos = [];

var escolha = PONTO;
var mouse_flag = 0;

canvas.onmousedown = function (evento) {
    var rect = canvas.getBoundingClientRect();

    mouse_x = evento.x - rect.x;
    mouse_y = evento.y - rect.y;
    //se apertar no botão direito do mouse o valor será 2
    //usado no desenho de polígono
    mouse_left = evento.button;

    switch (escolha) {
        case PONTO:
            objeto = new Ponto(context);
            objeto.adicionaPonto(mouse_x, mouse_y);
            objetos.push(objeto);
            objeto.draw();
            break;
        case RETA:
            if (mouse_flag == 0) {
                objeto = new Reta(context);
                objeto.adicionaPonto(mouse_x, mouse_y);
                mouse_flag++;
            }
            else {
                objeto.adicionaPonto(mouse_x, mouse_y);
                objeto.draw(objetos);
                objetos.push(objeto);
                mouse_flag = 0;
            }
            break;
        case POLIGONO:
            if (mouse_left != 2) {
                if (mouse_flag == 0) {
                    objeto = new Poligono(context);
                    objeto.adicionaPonto(mouse_x, mouse_y);
                    mouse_flag++;
                }
                else {
                    objeto.adicionaPonto(mouse_x, mouse_y);
                    mouse_flag++;
                }
            }
            else {
                if (mouse_flag < 2) {
                    alert("Forneça Ao Menos Três Pontos Antes de Terminar o Polígono!");
                }
                else {
                    objeto.adicionaPonto(mouse_x, mouse_y);
                    objetos.push(objeto);
                    objeto.draw();
                    mouse_flag = 0;
                }
            }
            break;
        case CIRCULO:
            if (mouse_flag == 0) {
                objeto = new Circulo(context);
                objeto.adicionaPonto(mouse_x, mouse_y);
                mouse_flag++;
            }
            else {
                objeto.adicionaPonto(mouse_x, mouse_y);
                objetos.push(objeto);
                objeto.draw();
                mouse_flag = 0;
            }
            break;
        case BEZIER:
            if (mouse_flag == 0) {
                objeto = new CurvaDeBezier(context);
                objeto.adicionaPonto(mouse_x, mouse_y);
                mouse_flag++;
            }
            else {
                objeto.adicionaPonto(mouse_x, mouse_y);
                mouse_flag++;

                if (mouse_flag == 4) {
                    objetos.push(objeto);
                    objeto.draw();
                    mouse_flag = 0;
                }
            }
            break;
    }
}

canvas.onmousemove = function (evento) {
    var rect = canvas.getBoundingClientRect();

    mouse_x = evento.x - rect.x;
    mouse_y = evento.y - rect.y;

    redraw();

    if (mouse_flag > 0) {
        objeto.drawPreview(mouse_x, mouse_y);
    }
}

function redraw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    var i;

    for (i = 0; i < Object.keys(objetos).length; i++) {
        objetos[i].draw(objetos);
    }
}

function BotaoClicado(nome) {
    switch (nome) {
        case "ponto":
            escolha = PONTO;
            mouse_flag = 0;
            break;
        case "reta":
            escolha = RETA;
            mouse_flag = 0;
            break;
        case "poligono":
            escolha = POLIGONO;
            break;
        case "circulo":
            escolha = CIRCULO;
            break;
        case "bezier":
            escolha = BEZIER;
            break;
        default:
            objeto = null;
            objetos = [];
            context.clearRect(0, 0, canvas.width, canvas.height);
            break;
    }

    mouse_flag = 0;
}

function EquacaoDaReta(x, x1, y1, x2, y2) {
    return (((x - x1) * (y2 - y1)) / (x2 - x1)) + y1;
}