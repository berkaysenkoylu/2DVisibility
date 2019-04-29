// Point object; with the attributes of coordinates and visual representation
function PointObject(xPos, yPos) {
    this.pointCoordinates = Point(xPos, yPos);
    this.pointSprite = document.getElementById('point');

    // Function to move the point object and the sprite to a given point
    this.move = function(x_coord, y_coord) {
        // Refresh the position of this object
        this.pointCoordinates.x = x_coord;
        this.pointCoordinates.y = y_coord;

        // Refresh the position of the image of this object
        this.pointSprite.style.left = x_coord - 5 + "px";
        this.pointSprite.style.top = y_coord - 10 + "px";

        // Every time this method is called, move() function 
        // in main.js (line 38) is also called
        move(this.pointCoordinates);
    }
}