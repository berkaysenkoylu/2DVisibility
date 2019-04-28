const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');

// Setup the random polygon points and order them angularly
var polygonPoints = [];
var polygon = new Polygon();
polygonPoints = polygon.generateRandomPolygonVertices(10);

var polygonCentroid = polygon.findCentroid();
polygonPoints = polygon.sortAngularly();

// Create a scene object and draw the polygon
var scene = new Scene(ctx);

let point = Point(polygonCentroid.x, polygonCentroid.y);
let endpoints = segmentatePolygon(polygonPoints, point);
let visibility = calculateVisibility(point, endpoints);

scene.drawScene(polygonPoints, point, visibility, '#0066FF', '#383838');

const move = (point) => {
    endpoints = segmentatePolygon(polygonPoints, point);
    visibility = calculateVisibility(point, endpoints);

    requestAnimationFrame(() => {
        scene.drawScene(polygonPoints, point, visibility, '#0066FF', '#383838');
    });
};

canvas.addEventListener('mousemove', ({pageX, pageY}) => {
    // Add a circle or sth to represent the agent
    // Point
    point = Point(pageX, pageY);

    move(point);
});
