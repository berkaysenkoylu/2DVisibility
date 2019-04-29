// Miscellanesous functions which are used throughout the project

// 
const flatMap = (cb, array) => 
    array.reduce((flatArray, item) => flatArray.concat(cb(item)), []);

// Function for getting the corners (vertices) from a provided list
// This is just a different representation of vertices, but if there 
// happens to be other objects along with the polygon, this might be usefull
function getCorners(vertexList) {
    corners = {};
    index = 0;
    vertexList.forEach(vertex => {
        corners["corner " + index] = vertex;
        index++;
    });
    
    return corners;
}

// Function to create a line segment object from the given corners
function makeSegmentsFromCorners(cornerObject) {
    segments = [];

    // Iterating through given corner object and creating a line segment 
    // from two each adjacent points and putting them into an array
    for(var i = 0; i < Object.keys(cornerObject).length - 1; i++) {
        let newSegment = Segment(cornerObject["corner " + i].x, cornerObject["corner " + i].y, 
                                 cornerObject["corner " + (i + 1)].x, cornerObject["corner " + (i + 1)].y);
        segments.push(newSegment);
    }
    
    // Returning a copy of segments array
    return [...segments];
}

// Function to calculate the angles between point of interest (the point object) 
// and each of the endpoints of the segments, as well as the distance between
// the median point of two endpoints of a segment and the point of interest
function calculateEndpointAngles(pointOfInterest, segment) {
    const { x, y } = pointOfInterest;
    const dx = 0.5 * (segment.p1.x + segment.p2.x) - x;
    const dy = 0.5 * (segment.p1.y + segment.p2.y) - y;
    
    segment.d = (dx * dx) + (dy * dy);

    segment.p1.angle = Math.atan2(segment.p1.y - y, segment.p1.x - x);
    segment.p2.angle = Math.atan2(segment.p2.y - y, segment.p2.x - x);
}

// Function to set the segment beginning
function setBeginningOfSegment(segment) {
    let dAngle = segment.p2.angle - segment.p1.angle;

    if (dAngle <= -Math.PI) {
        dAngle += 2 * Math.PI;
    }

    if (dAngle > Math.PI) {
        dAngle -= 2 * Math.PI
    }

    segment.p1.beginsSegment = dAngle > 0;
    segment.p2.beginsSegment = !segment.p1.beginsSegment;
}

// Function to complete segments array (The whole line segments of a polygon)
// Each segment contains the endpoints, squared distance between the point of
// interest and middle point of segment
function processSegments(pointOfInterest, segments) {
    for (var i = 0; i < segments.length; i++) {
        let segment = segments[i];
        calculateEndpointAngles(pointOfInterest, segment);
        setBeginningOfSegment(segment);
    }

    return segments;
}

// Function to obtain end points of a given segment
function getSegmentEndpoints(segment) {
    return [segment.p1, segment.p2];
}

// Function to create a segment from a given list of polygon vertices and 
// create the associated line segments, with all the necessary information
// such as endpoint angles, distance, etc.. (see objects.js)
function segmentatePolygon(polygonPoints, pointOfInterest) {
    const segments = makeSegmentsFromCorners(getCorners(polygonPoints));

    const processedSegments = processSegments(pointOfInterest, segments);

    const endpoints = flatMap(getSegmentEndpoints, processedSegments);
    
    return endpoints;
}

// Function to get the intersection point of two lines 
function lineIntersection(point1, point2, point3, point4) {
    const s = (
        (point4.x - point3.x) * (point1.y - point3.y) - (point4.y - point3.y) * (point1.x - point3.x)
    ) / (
        (point4.y - point3.y) * (point2.x - point1.x) - (point4.x - point3.x) * (point2.y - point1.y)
    );

    return Point(
        point1.x + s * (point2.x - point1.x), point1.y + s * (point2.y - point1.y)
    );
};

// Function to check if segment lies left of a given point
function segmentLeftOfPoint(segment, point) {
    const cross = (segment.p2.x - segment.p1.x) * (point.y - segment.p1.y)
                - (segment.p2.y - segment.p1.y) * (point.x - segment.p1.x);
    return cross < 0;
};

// Function to interpolate between two points with f
function interpolate(pointA, pointB, f) {
    return Point(
        pointA.x * (1 - f) + pointB.x * f,
        pointA.y * (1 - f) + pointB.y * f
    );
};

// Function to check if a segment is in front of another one with respect to a relative point
function segmentInFrontOf(segmentA, segmentB, relativePoint) {
    const A1 = segmentLeftOfPoint(segmentA, interpolate(segmentB.p1, segmentB.p2, 0.01));
    const A2 = segmentLeftOfPoint(segmentA, interpolate(segmentB.p2, segmentB.p1, 0.01));
    const A3 = segmentLeftOfPoint(segmentA, relativePoint);
    const B1 = segmentLeftOfPoint(segmentB, interpolate(segmentA.p1, segmentA.p2, 0.01));
    const B2 = segmentLeftOfPoint(segmentB, interpolate(segmentA.p2, segmentA.p1, 0.01));
    const B3 = segmentLeftOfPoint(segmentB, relativePoint);

    if (B1 === B2 && B2 !== B3) return true;
    if (A1 === A2 && A2 === A3) return true;
    if (A1 === A2 && A2 !== A3) return false;
    if (B1 === B2 && B2 === B3) return false;

    return false;
}

// Function to compare the two endpoints of a segment in terms of 
// the info: angle and whether or not one begins the segment
function endpointComparison(pointA, pointB) {
    if (pointA.angle > pointB.angle) return 1;
    if (pointA.angle < pointB.angle) return -1;
    if (!pointA.beginsSegment && pointB.beginsSegment) return 1;
    if (pointA.beginsSegment && !pointB.beginsSegment) return -1;
    return 0;
}