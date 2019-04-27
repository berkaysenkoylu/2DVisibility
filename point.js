// function Point(origin = [0, 0]) {
//     this.origin = origin;

//     this.setOrigin = function(newOrigin) {
//         this.origin = newOrigin;
//     }

//     this.drawLine = function(ctx, px, py) {
//         ctx.save();
//         ctx.beginPath();
//         ctx.strokeStyle = 'black';
//         ctx.moveTo(this.origin[0], this.origin[1]);
//         ctx.lineTo(px, py);
//         ctx.closePath();
//         ctx.stroke();
//         ctx.restore();
//     }
// }