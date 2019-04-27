function Polygon() {
    this.vertices = [];
    this.centroid = [0, 0];

    this.generateRandomPolygonVertices = function(vertexNumber=5) {
        let count = 0;
        while(count < vertexNumber) {
            const x = Math.floor(Math.random() * 100 + 1) * 10;
            const y = Math.floor(Math.random() * 100 + 1) * 10;

            if(!this.vertices.includes([x, y])) {
                this.vertices.push([x, y]);
                count++;
            } else {
                continue;
            }
        }

        return this.vertices;
    }

    this.findCentroid = function() {
        for(let i = 0; i < this.vertices.length; i++) {
            this.centroid[0] += this.vertices[i][0];
            this.centroid[1] += this.vertices[i][1];
        }
        
        this.centroid[0] = this.centroid[0] / this.vertices.length;
        this.centroid[1] = this.centroid[1] / this.vertices.length;

        return this.centroid;
    }

    this.sortAngularly = function() {
        this.vertices.sort((a, b) => {
            var a1 = this.toDegrees(Math.atan2(a[0] - this.centroid[0], a[1] - this.centroid[1]) + 360) % 360;
            var a2 = this.toDegrees(Math.atan2(b[0] - this.centroid[0], b[1] - this.centroid[1]) + 360) % 360;

            return (a1 - a2);
        });

        // After sorting, add the first point to the sorted array
        // so that final edge will be drawn
        this.vertices.push(this.vertices[0]);

        return this.vertices;
    }

    this.toDegrees = function(angle) {
        return Math.PI * angle / 180;
    }

    // this.drawSegments = function(ctx, color, p1, p2) {
    //     ctx.save();
    //     ctx.beginPath();
    //     ctx.strokeStyle = 'black';
    //     ctx.moveTo(p1[0], p1[1]);
    //     ctx.lineTo(p2[0], p2[1]);
    //     ctx.closePath();
    //     ctx.stroke();
    //     ctx.fillStyle = color;
    //     ctx.fill();
    //     ctx.restore();
    // }

    // this.drawPolygon = function(color) {
    //     for(let i = 0; i < this.vertices.length; i++) {
    //         this.drawSegments(ctx, color, this.vertices[i], this.vertices[i+1]);
    //     }
        
    // }
}
