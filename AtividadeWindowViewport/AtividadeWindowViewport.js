function PontoRelativo(window, viewport, ponto) {
    ratio_x = viewport.width / window.width;
    ratio_y = viewport.height / window.height;

    pontoRelativo = new Ponto();

    pontoRelativo.x = viewport.x + (ponto.x - window.x) * ratio_x;
    pontoRelativo.y = viewport.y + (ponto.y - window.y) * ratio_y;

    return pontoRelativo;
}

function CalculaViewport(buildingbox, canvas) {
    ratio = canvas.height / buildingbox.height;

    //Calcula nova altura e largura de buildingbox
    viewport.height = buildingbox.height * ratio;
    viewport.width = buildingbox.width * ratio;

    //Calcula posição da buildingbox no centro do canvas
    viewport.x = canvas.x + (canvas.width / 2) - (viewport.width / 2);
    viewport.y = canvas.y;

    return viewport;
}