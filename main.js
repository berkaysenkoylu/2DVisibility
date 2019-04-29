// Get the canvas HTML element
const canvas = document.getElementById('scene');

// Get the canvas's 2d context
const ctx = canvas.getContext('2d');

// TODO: Read from file and if file is not null, draw the scene by using the data from the file


// If file is null, then draw the polygon randomly
// Setup the random polygon points and order them angularly
var polygonPoints = [];
var polygonVertexCount = 20;
var polygon = new Polygon();
polygonPoints = polygon.generateRandomPolygonVertices(polygonVertexCount);

var polygonCentroid = polygon.findCentroid();
polygonPoints = polygon.sortAngularly();

// Create a scene object and draw the polygon
var scene = new Scene(ctx);

// Create a point object whose initial coordinate is that of the polygon centroid
let point = Point(polygonCentroid.x, polygonCentroid.y);

// Form a point object
let pointObj = new PointObject(point.x, point.y);

// Initially calculate the line segments and line segment's endpoints
let endpoints = segmentatePolygon(polygonPoints, pointObj.pointCoordinates);

// Initially calculate the visibility given the point object's coordinates and endpoints of the present line segments in the scene
let visibility = calculateVisibility(pointObj.pointCoordinates, endpoints);

// Draw the initial scene
scene.drawScene(polygonPoints, pointObj.pointCoordinates, visibility, '#0066FF', '#383838');

// Function that is going to be called whenever the point is moved (dragged and dropped)
const move = (point) => {
  // Check if the point is within the polygon, if so; recalculate the line 
  // segment end points and visibility based on the newly calculated data
  if(scene.pointInPolygon(polygonPoints, point)){
    endpoints = segmentatePolygon(polygonPoints, point);
    visibility = calculateVisibility(point, endpoints);
  }

  // Redraw the scene by utilizing the newly calculated data
  requestAnimationFrame(() => {
      scene.drawScene(polygonPoints, point, visibility, '#0066FF', '#383838');
  });
};

// Initially call the move() method of the point object to initialize the scene
pointObj.move(point.x, point.y);

// ============ DRAG AND DROP THE POINT OBJECT ====================== //
pointObj.pointSprite.onmousedown = function(event) {

  // let shiftX = event.clientX - pointObj.pointSprite.getBoundingClientRect().left;
  // let shiftY = event.clientY - pointObj.pointSprite.getBoundingClientRect().top;

  pointObj.pointSprite.style.position = 'absolute';
  pointObj.pointSprite.style.zIndex = 1000;
  document.body.append(pointObj.pointSprite);

  moveAt(event.pageX, event.pageY);

  // centers the ball at (pageX, pageY) coordinates
  function moveAt(pageX, pageY) {
    // Call the move method of point object
      pointObj.move(pageX, pageY);
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // Move the object when mouse move
  document.addEventListener('mousemove', onMouseMove);

  // Drop the object when mouse up and clean up
  pointObj.pointSprite.onmouseup = function() {
    document.removeEventListener('mousemove', onMouseMove);
    pointObj.pointSprite.onmouseup = null;
  };
  
};
  
pointObj.pointSprite.ondragstart = function() {
  return false;
};
// ================================================================== //