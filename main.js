const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');

// var config = {
//     apiKey: "AIzaSyA1CQjEQmr4Go9kLceOJWxFmvKWIIhWhkU",
//     authDomain: "cghw-a2690.firebaseapp.com",
//     databaseURL: "https://cghw-a2690.firebaseio.com",
//     projectId: "cghw-a2690",
//     storageBucket: "cghw-a2690.appspot.com",
//     messagingSenderId: "1002496836568"
// };

// firebase.initializeApp(config);

// let data;

// var ref = firebase.database().ref(); 

               
// ref.on("value", function(snapshot){
//     data = JSON.stringify(snapshot.val(), null, 2);
// });


// Setup the random polygon points and order them angularly
var polygonPoints = [];
var polygon = new Polygon();
polygonPoints = polygon.generateRandomPolygonVertices(20);

var polygonCentroid = polygon.findCentroid();
polygonPoints = polygon.sortAngularly();

// Create a scene object and draw the polygon
var scene = new Scene(ctx);

let point = Point(polygonCentroid.x, polygonCentroid.y);

let pointObj = new PointObject(point.x, point.y);


// let endpoints = segmentatePolygon(polygonPoints, point);
// let visibility = calculateVisibility(point, endpoints);

let endpoints = segmentatePolygon(polygonPoints, pointObj.pointCoordinates);
let visibility = calculateVisibility(pointObj.pointCoordinates, endpoints);

scene.drawScene(polygonPoints, pointObj.pointCoordinates, visibility, '#0066FF', '#383838');

const move = (point) => {
    endpoints = segmentatePolygon(polygonPoints, point);
    visibility = calculateVisibility(point, endpoints);

    requestAnimationFrame(() => {
        scene.drawScene(polygonPoints, point, visibility, '#0066FF', '#383838');
    });
};

pointObj.move(point.x, point.y);

// canvas.addEventListener('mousemove', ({pageX, pageY}) => {
//     // Add a circle or sth to represent the agent
//     // Point
//     // point = Point(pageX, pageY);
//     pointObj.move(pageX, pageY);
//     // move(point);
//     // move(pointObj.pointCoordinates);
// });

pointObj.pointSprite.onmousedown = function(event) {

    let shiftX = event.clientX - pointObj.pointSprite.getBoundingClientRect().left;
    let shiftY = event.clientY - pointObj.pointSprite.getBoundingClientRect().top;
  
    pointObj.pointSprite.style.position = 'absolute';
    pointObj.pointSprite.style.zIndex = 1000;
    document.body.append(pointObj.pointSprite);
  
    moveAt(event.pageX, event.pageY);
  
    // centers the ball at (pageX, pageY) coordinates
    function moveAt(pageX, pageY) {
        pointObj.move(pageX, pageY);
    }
  
    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }
  
    // (3) move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);
  
    // (4) drop the ball, remove unneeded handlers
    pointObj.pointSprite.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      pointObj.pointSprite.onmouseup = null;
    };
  
  };
  
  pointObj.pointSprite.ondragstart = function() {
    return false;
  };
