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

        // Check if the mouse cursor is in the polygon
        if (this.pointInPolygon(pointsArray, point) === true) {
            this.drawVisibilityTriangles(triangleColor, point, visibility);
        }
    }

    this.pointInPolygon = function(pointsArray, point) {
        let i = 0;
        let j = 0;
        let c = 0;

        for (i = 0, j = pointsArray.length - 1; i < pointsArray.length; j = i++) {
            if (((pointsArray[i].y > point.y) !== (pointsArray[j].y > point.y)) && 
                (point.x < (pointsArray[j].x - pointsArray[i].x) * (point.y - pointsArray[i].y) / (pointsArray[j].y - pointsArray[i].y) + pointsArray[i].x)) {
                    c = !c;
                }
        }

        return c;
    }
}
