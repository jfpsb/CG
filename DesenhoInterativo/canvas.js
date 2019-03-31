var canvas = document.getElementById('canvas');

var context = canvas.getContext('2d');

const PONTO = 1;
const RETA = 2;
const POLIGONO = 3;
const CIRCULO = 4;
const BEZIER = 5;

var escolha = PONTO;
var mouse_flag = 0;

function draw() {
    BtnPonto = new Botao(context, 1100, 10, 170, 60, "Ponto", "#7ebeff", "black");
    BtnReta = new Botao(context, 1100, 80, 170, 60, "Reta", "#7ebeff", "black");
    BtnPoligono = new Botao(context, 1100, 150, 170, 60, "Polígono", "#7ebeff", "black");
    BtnCirculo = new Botao(context, 1100, 220, 170, 60, "Círculo", "#7ebeff", "black");
    BtnBezier = new Botao(context, 1100, 290, 170, 60, "Curva de Bezier", "#7ebeff", "black");
    BtnApagar = new Botao(context, 1100, 360, 170, 60, "Apagar Tudo", "#7ebeff", "black");
}

canvas.onmousedown = function (evento) {
    var rect = canvas.getBoundingClientRect();

    mouse_x = evento.x - rect.x;
    mouse_y = evento.y - rect.y;
    //se apertar no botão direito do mouse o valor será 2
    //usado no desenho de polígono
    mouse_left = evento.button;

    if (BotaoClicado(mouse_x, mouse_y)) {
        mouse_flag = 0;
    }
    else {
        switch (escolha) {
            case PONTO:
                context.fillRect(mouse_x, mouse_y, 3, 3);
                break;
            case RETA:
                if (mouse_flag == 0) {
                    context.beginPath();
                    context.moveTo(mouse_x, mouse_y);
                    mouse_flag++;
                }
                else {
                    context.lineTo(mouse_x, mouse_y);
                    context.stroke();
                    mouse_flag = 0;
                }
                break;
            case POLIGONO:
                if (mouse_left != 2) {
                    if (mouse_flag == 0) {
                        context.beginPath();
                        context.moveTo(mouse_x, mouse_y);
                        mouse_flag++;
                    }
                    else {
                        context.lineTo(mouse_x, mouse_y);
                        mouse_flag++;
                    }
                }
                else {
                    if (mouse_flag < 3) {
                        alert("Forneça Um Terceiro Ponto Antes de Terminar o Polígono!");
                    }
                    else {
                        context.closePath(); //Conecta primeiro ponto com o último
                        context.fill();
                        mouse_flag = 0;
                    }
                }
                break;
            case CIRCULO:
                if (mouse_flag == 0) {
                    context.beginPath();
                    centro_x = mouse_x;
                    centro_y = mouse_y;
                    mouse_flag++;
                }
                else {
                    raio = Math.sqrt(Math.pow(mouse_x - centro_x, 2) + Math.pow(mouse_y - centro_y, 2));
                    context.arc(centro_x, centro_y, raio, 0, 2 * Math.PI);
                    context.fill();
                    mouse_flag = 0;
                }
                break;
            case BEZIER:
                if (mouse_flag == 0) {
                    context.beginPath();
                    context.moveTo(mouse_x, mouse_y);
                    pontos_x = new Array(3);
                    pontos_y = new Array(3);
                    mouse_flag++;
                }
                else {
                    pontos_x[mouse_flag - 1] = mouse_x;
                    pontos_y[mouse_flag - 1] = mouse_y;

                    mouse_flag++;

                    if (mouse_flag == 4) {
                        context.bezierCurveTo(pontos_x[0], pontos_y[0], pontos_x[1], pontos_y[1], pontos_x[2], pontos_y[2]);
                        context.stroke();
                        mouse_flag = 0;
                    }
                }
                break;
        }
    }
}

function BotaoClicado(x, y) {
    if (BtnPonto.clicado(x, y)) {
        escolha = PONTO;
        return true;
    }

    if (BtnReta.clicado(x, y)) {
        escolha = RETA;
        return true;
    }

    if (BtnPoligono.clicado(x, y)) {
        escolha = POLIGONO;
        return true;
    }

    if (BtnCirculo.clicado(x, y)) {
        escolha = CIRCULO;
        return true;
    }

    if (BtnBezier.clicado(x, y)) {
        escolha = BEZIER;
        return true;
    }

    if (BtnApagar.clicado(x, y)) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        draw();
        return true;
    }

    return false;
}