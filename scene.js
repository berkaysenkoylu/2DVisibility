function Scene(ctx) {

    this.ctx = ctx;

    this.drawPolygon = function(pointsArray, fillColor, strokeColor="#000") {
        if (pointsArray.length <= 0) 
            return;

        this.ctx.moveTo(pointsArray[0].x, pointsArray[0].y);

        for (var i = 0; i < pointsArray.length-1; i++) {
            this.drawSegment(strokeColor, { p1: pointsArray[i], p2: pointsArray[i+1] });
        }
        
        // if (strokeColor != null && strokeColor != undefined){
        //     this.ctx.strokeStyle = strokeColor;
        //     //this.ctx.lineWidth = 2;
        //     this.ctx.stroke();
        // }

        if (fillColor != null && fillColor != undefined) {
            this.ctx.fillStyle = fillColor;
            //this.ctx.fill();
        }
    };

    this.drawSegment = function(color, {p1, p2}) {
        this.ctx.save();
        this.ctx.beginPath();
        if (color){
            this.ctx.strokeStyle = color;
        } else {
            this.ctx.strokeStyle = 'black';
        }
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
    };

    this.drawVisibilityTriangles = function(color, point, visibilityOutput) {
        this.ctx.save();
        this.ctx.strokeStyle = color;
        for(var i = 0; i < visibilityOutput.length; i++){
            let [p1, p2] = visibilityOutput[i];
            this.ctx.moveTo(point.x, point.y);
            this.ctx.lineTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.fill();
            this.ctx.closePath();
            this.ctx.stroke();
        }
        this.ctx.restore();
    };

    this.drawScene = function(pointsArray, point, visibility, polygonColor, triangleColor) {
        this.ctx.clearRect(-10000, -10000, 20000, 20000);
        this.drawPolygon(pointsArray, polygonColor);
        this.drawVisibilityTriangles(triangleColor, point, visibility);
    }
}
