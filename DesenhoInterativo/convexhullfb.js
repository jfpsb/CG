/**
 * Compute convex hull
 */
function ConvexHullFB(context, pontos) {
    var num_pontos = Object.keys(pontos).length;

    for (var i = 0; i < num_pontos; i++) {
        for (var j = 0; j < num_pontos; j++) {
            if (i === j) {
                continue;
            }

            var ptI = pontos[i];
            var ptJ = pontos[j];

            // Do all other points lie within the half-plane to the right
            var allPointsOnTheRight = true;
            for (var k = 0; k < num_pontos; k++) {
                if (k === i || k === j) {
                    continue;
                }

                var d = whichSideOfLine(ptI, ptJ, pontos[k]);
                if (d < 0) {
                    allPointsOnTheRight = false;
                    break;
                }
            }

            if (allPointsOnTheRight) {
                context.strokeStyle = "#FF0000";
                context.beginPath();
                context.moveTo(ptI.x, ptI.y);
                context.lineTo(ptJ.x, ptJ.y);
                context.stroke();
            }

        }
    }
};

/**
 * Determine which side of a line a given point is on
 */
var whichSideOfLine = function (lineEndptA, lineEndptB, ptSubject) {
    return (ptSubject.x - lineEndptA.x) * (lineEndptB.y - lineEndptA.y) - (ptSubject.y - lineEndptA.y) * (lineEndptB.x - lineEndptA.x);
};