var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var info_text = document.getElementById("info_text");

const PONTO = 1;
const RETA = 2;
const POLIGONO = 3;
const CIRCULO = 4;
const BEZIER = 5;
const PINTAR = 6;
const AREA = 7;
const DRAGNDROP = 8;
const ESPELHAMENTO = 9;
const ROTACAO = 10;
const ESCALAMENTO = 11;

var objeto;
var objeto2;
var objetos = [];
var i;

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
            if (mouse_left != 2) {
                objeto = new Ponto(context);
                objeto.adicionaPonto(mouse_x, mouse_y);
                objetos.push(objeto);
                objeto.draw();
            }
            break;
        case RETA:
            if (mouse_left != 2) {
                if (mouse_flag == 0) {
                    objeto = new Reta(context);
                    objeto.adicionaPonto(mouse_x, mouse_y);
                    mouse_flag++;
                    info_text.innerHTML = "Selecione o Segundo Ponto Da Reta";
                }
                else {
                    objeto.adicionaPonto(mouse_x, mouse_y);
                    objeto.draw(objetos);
                    objetos.push(objeto);
                    mouse_flag = 0;
                    info_text.innerHTML = "Você Está Desenhando Uma Reta";
                }
            }
            break;
        case POLIGONO:
            if (mouse_left != 2) {
                if (mouse_flag == 0) {
                    objeto = new Poligono(context);
                    objeto.adicionaPonto(mouse_x, mouse_y);
                    mouse_flag++;
                    info_text.innerHTML = "Selecione o Próximo Ponto Do Polígono. Aperte o Botão Direito do Mouse Para Encerrar";
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
                    info_text.innerHTML = "Você Está Desenhando Um Polígono";
                }
            }
            break;
        case CIRCULO:
            if (mouse_left != 2) {
                if (mouse_flag == 0) {
                    objeto = new Circulo(context);
                    objeto.adicionaPonto(mouse_x, mouse_y);
                    mouse_flag++;
                    info_text.innerHTML = "Selecione o Ponto Onde O Círculo Irá Terminar";
                }
                else {
                    objeto.adicionaPonto(mouse_x, mouse_y);
                    objetos.push(objeto);
                    objeto.draw();
                    mouse_flag = 0;
                    info_text.innerHTML = "Você Está Desenhando Um Círculo";
                }
            }
            break;
        case BEZIER:
            if (mouse_left != 2) {
                if (mouse_flag == 0) {
                    objeto = new CurvaDeBezier(context);
                    objeto.adicionaPonto(mouse_x, mouse_y);
                    mouse_flag++;
                    info_text.innerHTML = "Selecione o Próximo Ponto Da Curva De Bezier";
                }
                else {
                    objeto.adicionaPonto(mouse_x, mouse_y);
                    mouse_flag++;

                    if (mouse_flag == 4) {
                        objetos.push(objeto);
                        objeto.draw();
                        mouse_flag = 0;
                        info_text.innerHTML = "Você Está Desenhando Uma Curva de Bezier";
                    }
                }
            }
            break;
        case PINTAR:
            if (mouse_left != 2) {
                for (i = Object.keys(objetos).length - 1; i >= 0; i--) {
                    var obj = objetos[i];
                    if (typeof obj.clicado === "function") {
                        if (obj.clicado(mouse_x, mouse_y)) {
                            if (obj.cor == "#000000") {
                                obj.cor = "#FFFF00";
                            }
                            else {
                                obj.cor = "#000000";
                            }
                            redraw();
                            break;
                        }
                    }
                }
            }
            break;
        case AREA:
            if (mouse_left != 2) {
                var clicado = null;

                for (i = Object.keys(objetos).length - 1; i >= 0; i--) {
                    var obj = objetos[i];

                    if (obj instanceof Reta
                        || obj instanceof Ponto
                        || obj instanceof CurvaDeBezier) {
                        continue;
                    }

                    if (obj.clicado(mouse_x, mouse_y)) {
                        obj.drawSelection();
                        clicado = obj;
                        break;
                    }
                }

                if (clicado instanceof Circulo) {
                    alerta("A área em pixels² da circunferência clicada é: " + clicado.area());
                }
                else if (clicado instanceof Poligono) {
                    alerta("A área em pixels² do polígono clicado é: " + clicado.area());
                }
            }
            break;
        case DRAGNDROP:
            if (mouse_left != 2) {
                if (mouse_flag == 0) {
                    for (i = Object.keys(objetos).length - 1; i >= 0; i--) {
                        objeto = objetos[i];

                        if (objeto.clicado(mouse_x, mouse_y)) {
                            objeto.iniciaTransformacao(mouse_x, mouse_y);
                            mouse_flag = 1;
                            info_text.innerHTML = "Clique Novamente Para Finalizar";
                            break;
                        }
                    }
                }
                else {
                    mouse_flag = 0;
                    objeto.finalizaTransformacao();
                    info_text.innerHTML = "Você Está Mudando a Posição de um Objeto.<br />Clique No Objeto Que Deseja Mudar de Posição. Clique Novamente Para Fixar Em Nova Posição";
                }
            }
            break;
        case ESCALAMENTO:
            if (mouse_left != 2) {
                if (mouse_flag == 0) {
                    for (i = Object.keys(objetos).length - 1; i >= 0; i--) {
                        objeto = objetos[i];

                        if (objeto.clicado(mouse_x, mouse_y)) {
                            objeto.iniciaTransformacao(mouse_x, mouse_y);
                            mouse_flag = 1;
                            info_text.innerHTML = "Mova a Seta do Mouse para Direita ou Esquerda";
                            break;
                        }
                    }
                }
                else {
                    mouse_flag = 0;
                    objeto.finalizaTransformacao();
                    info_text.innerHTML = "Você Está Escalando um Objeto. Clique No Objeto Que Deseja Escalar e Use a Seta do Mouse.<br/>Clique Novamente para Finalizar";
                }
            }
            break;
        case ROTACAO:
            if (mouse_left != 2) {
                if (mouse_flag == 0) {
                    for (i = Object.keys(objetos).length - 1; i >= 0; i--) {
                        objeto = objetos[i];

                        if (objeto.clicado(mouse_x, mouse_y)) {
                            mouse_flag = 1;
                            info_text.innerHTML = "Selecione no Canvas o Ponto De Rotação";
                            break;
                        }
                    }
                }
                else if (mouse_flag == 1) {
                    objeto.iniciaTransformacao(mouse_x, mouse_y);
                    mouse_flag = 2;
                }
                else {
                    mouse_flag = 0;
                    objeto.finalizaTransformacao();
                    info_text.innerHTML = "Você Está Rotacionando um Objeto.<br/>Clique no Objeto Que Deseja Rotacionar, Depois Clique Onde Será o Ponto de Rotação";
                }
            }
            break;
        case ESPELHAMENTO:
            if (mouse_left != 2) {
                if (mouse_flag == 0) {
                    for (i = Object.keys(objetos).length - 1; i >= 0; i--) {
                        objeto = objetos[i];

                        if (objeto.clicado(mouse_x, mouse_y)) {
                            mouse_flag = 1;
                            info_text.innerHTML = "Selecione o Primeiro Ponto da Reta de Espelhamento";
                            break;
                        }
                    }
                }
                else if (mouse_flag == 1) {
                    objeto2 = new Reta(context);
                    objeto2.adicionaPonto(mouse_x, mouse_y);
                    mouse_flag = 2;
                    info_text.innerHTML = "Selecione o Segundo Ponto da Reta de Espelhamento";
                }
                else if (mouse_flag == 2) {
                    objeto2.adicionaPonto(mouse_x, mouse_y);
                    objeto2.draw();
                    objeto.iniciaTransformacao(objeto2);
                    var o = objeto.executaEspelhamento();
                    objeto.finalizaTransformacao();
                    mouse_flag = 0;

                    objetos.push(o);

                    info_text.innerHTML = "Você Está Espelhando um Objeto.<br/>Clique no Objeto que Deseja Espelhar, Depois Desenhe a Reta Usada no Espelhamento";
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
        switch (escolha) {
            case DRAGNDROP:
                objeto.executaTranslacao(mouse_x, mouse_y);
                break;
            case ESCALAMENTO:
                objeto.executaEscalamento(mouse_x, mouse_y);
                break;
            case ROTACAO:
                if (mouse_flag > 1)
                    objeto.executaRotacao(mouse_x, mouse_y);
                break;
            case ESPELHAMENTO:
                if (mouse_flag == 0)
                    objeto.drawPreview(mouse_x, mouse_y);

                if (mouse_flag == 2)
                    objeto2.drawPreview(mouse_x, mouse_y);
                break;
            default:
                objeto.drawPreview(mouse_x, mouse_y);
                break;
        }
    }
}

function redraw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (i = 0; i < Object.keys(objetos).length; i++) {
        objetos[i].draw(objetos);
    }
}

//TODO: Melhorar o código de mudar info
function BotaoClicado(nome) {
    switch (nome) {
        case "ponto":
            escolha = PONTO;
            info_text.innerHTML = "Você Está Desenhando Um Ponto";
            break;
        case "reta":
            escolha = RETA;
            info_text.innerHTML = "Você Está Desenhando Uma Reta";
            break;
        case "poligono":
            escolha = POLIGONO;
            info_text.innerHTML = "Você Está Desenhando Um Polígono";
            break;
        case "circulo":
            escolha = CIRCULO;
            info_text.innerHTML = "Você Está Desenhando Um Círculo";
            break;
        case "bezier":
            escolha = BEZIER;
            info_text.innerHTML = "Você Está Desenhando Uma Curva de Bezier";
            break;
        case "pintar":
            escolha = PINTAR;

            info_text.innerHTML = "Você Está Pintando Um Objeto. Clique No Objeto Que Deseja Pintar.<br />Clique Novamente Para Que Retorne a Cor";

            break;
        case "area":
            escolha = AREA;

            info_text.innerHTML = "Você Está Calculando a Área de um Objeto. Clique No Objeto Que Deseja Calcular a Área";

            break;
        case "dragndrop":
            escolha = DRAGNDROP;

            info_text.innerHTML = "Você Está Mudando a Posição de um Objeto.<br />Clique No Objeto Que Deseja Mudar de Posição. Clique Novamente Para Fixar Em Nova Posição";

            break;
        case "escalamento":
            escolha = ESCALAMENTO;

            info_text.innerHTML = "Você Está Escalando um Objeto. Clique No Objeto Que Deseja Escalar e Use a Seta do Mouse.<br/>Clique Novamente para Finalizar";

            break;
        case "rotacao":
            escolha = ROTACAO;

            info_text.innerHTML = "Você Está Rotacionando um Objeto.<br/>Clique no Objeto Que Deseja Rotacionar, Depois Clique Onde Será o Ponto de Rotação";

            break;
        case "espelhamento":
            escolha = ESPELHAMENTO;

            info_text.innerHTML = "Você Está Espelhando um Objeto.<br/>Clique no Objeto que Deseja Espelhar, Depois Desenhe a Reta Usada no Espelhamento";

            break;
        case "quickhull":
            var num_pontos = 0;
            var pontos = [];
            for (var i = 0; i < Object.keys(objetos).length; i++) {
                var obj = objetos[i];
                for (var j = 0; j < Object.keys(obj.pontos).length; j++) {
                    var ponto = obj.pontos[j];
                    pontos.push(ponto);
                    num_pontos++;
                }
            }

            if (num_pontos < 3) {
                info_text.innerHTML = "Não Há Pontos Suficientes No Canvas";
                return;
            }

            var h = QuickHull(pontos);

            context.strokeStyle = "#FF0000";

            context.beginPath();
            context.moveTo(h[0].x, h[0].y);

            for (var i = 1; i < hull.length; i++) {
                context.lineTo(h[i].x, h[i].y);
            }

            context.closePath();
            context.stroke();

            info_text.innerHTML = "Mostrando Fecho Convexo de Todos os Pontos Do Canvas";

            break;
        case "forcabruta":
            var num_pontos = 0;
            var pontos = [];
            for (var i = 0; i < Object.keys(objetos).length; i++) {
                var obj = objetos[i];
                for (var j = 0; j < Object.keys(obj.pontos).length; j++) {
                    var ponto = obj.pontos[j];
                    pontos.push(ponto);
                    num_pontos++;
                }
            }

            if (num_pontos < 3) {
                info_text.innerHTML = "Não Há Pontos Suficientes No Canvas";
                return;
            }

            ConvexHullFB(context, pontos);

            info_text.innerHTML = "Mostrando Fecho Convexo de Todos os Pontos Do Canvas";

            break;
        default:
            objeto = null;
            objeto2 = null;
            objetos = [];
            info_text.innerHTML = "Aperte Em Um Botão!";
            context.clearRect(0, 0, canvas.width, canvas.height);
            break;
    }

    mouse_flag = 0;
}

function alerta(mensagem) {
    //Atraso de 20ms na mensagem
    setTimeout(function () {
        alert(mensagem);
    }, 20);
}