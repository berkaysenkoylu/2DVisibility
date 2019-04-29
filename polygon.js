// Polygon object with vertices and centroid attributes
function Polygon() {
    this.vertices = [];
    this.centroid = Point(0, 0);

    // Method responsible for generating random vertices
    this.generateRandomPolygonVertices = function(vertexNumber=5) {
        let count = 0;
        while(count < vertexNumber) {
            const x = Math.floor(Math.random() * 100 + 1) * 10;
            const y = Math.floor(Math.random() * 100 + 1) * 10;

            let point = Point(x, y);

            if(!this.vertices.includes(point)) {
                this.vertices.push(point);
                count++;
            } else {
                continue;
            }
        }

        return this.vertices;
    }

    // Method to find centroid of the polygon
    this.findCentroid = function() {
        for(let i = 0; i < this.vertices.length; i++) {
            this.centroid.x += this.vertices[i].x;
            this.centroid.y += this.vertices[i].y;
        }
        
        this.centroid.x = this.centroid.x / this.vertices.length;
        this.centroid.y = this.centroid.y / this.vertices.length;

        return this.centroid;
    }

    // Method the sort the vertices of polygon with respect to its centroid point
    this.sortAngularly = function() {
        this.vertices.sort((a, b) => {
            var a1 = this.toDegrees(Math.atan2(a.x - this.centroid.x, a.y - this.centroid.y) + 360) % 360;
            var a2 = this.toDegrees(Math.atan2(b.x - this.centroid.x, b.y - this.centroid.y) + 360) % 360;

            return (a1 - a2);
        });

        // After sorting, add the first point to the sorted array
        // so that final edge will be drawn
        this.vertices.push(this.vertices[0]);
        
        return this.vertices;
    }

    // Method to convert radians to degrees
    this.toDegrees = function(angle) {
        return Math.PI * angle / 180;
    }
}