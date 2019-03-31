class Botao {
    constructor(context, x, y, width, height, text, background, foreground) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.background = background;
        this.foreground = foreground;

        context.fillStyle = background;

        //Tamanho fonte padrão
        this.fontSize = 30;

        //Preenche botão
        context.fillRect(x, y, width, height);
        //Desenha borda
        context.strokeRect(x, y, width, height);

        context.fillStyle = foreground;

        //Calcula posição do texto
        context.font = this.fontSize + "px Arial";

        var fontWidth = context.measureText(this.text).width;

        if (fontWidth > width) {
            this.fontSize = (this.width * this.fontSize) / fontWidth;
            context.font = this.fontSize + "px Arial";
        }

        fontWidth = context.measureText(this.text).width;

        var textX = ((((this.x + this.width) - fontWidth) - this.x) / 2) + this.x;
        var textY = this.y + (this.height / 2) + (this.fontSize / 2);

        context.fillText(text, textX, textY);
    }

    clicado(x, y) {
        if (x >= this.x && y >= this.y && x <= (this.x + this.width) && y <= (this.y + this.height)) {
            return true;
        }

        return false;
    }
}