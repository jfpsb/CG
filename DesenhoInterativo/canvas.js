var canvas = document.getElementById('canvas');

var context = canvas.getContext('2d');

context.fillStyle = '#7ebeff';

context.fillRect(1100, 10, 170, 60);
context.fillRect(1100, 80, 170, 60);
context.fillRect(1100, 150, 170, 60);
context.fillRect(1100, 220, 170, 60);
context.fillRect(1100, 290, 170, 60);
context.fillRect(1100, 360, 170, 60);

context.strokeRect(1100, 10, 170, 60);
context.strokeRect(1100, 80, 170, 60);
context.strokeRect(1100, 150, 170, 60);
context.strokeRect(1100, 220, 170, 60);
context.strokeRect(1100, 290, 170, 60);
context.strokeRect(1100, 360, 170, 60);

context.fillStyle = 'black';
context.font = "30px Arial";
context.fillText("Ponto", 1150, 50);
context.fillText("Reta", 1150, 120);

context.font = "25px Arial";

context.fillText("Polígono", 1140, 190);
context.fillText("Círculo", 1150, 260);

context.font = "20px Arial";

context.fillText("Curva De Bezier", 1110, 330);
context.fillText("Apagar Tudo", 1130, 400);

