function PointObject(xPos, yPos) {
    this.pointCoordinates = Point(xPos, yPos);
    this.pointSprite = document.getElementById('point');

    this.move = function(x_coord, y_coord) {
        this.pointCoordinates.x = x_coord;
        this.pointCoordinates.y = y_coord;

        this.pointSprite.style.left = x_coord - 5 + "px";
        this.pointSprite.style.top = y_coord - 10 + "px";

        move(this.pointCoordinates);
    }
}