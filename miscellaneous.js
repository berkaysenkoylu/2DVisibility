const flatMap = (cb, array) => 
    array.reduce((flatArray, item) => flatArray.concat(cb(item)), []);

// Fnction for getting the corners (vertices) from a provided list
function getCorners(vertexList) {
    corners = {};
    index = 0;
    vertexList.forEach(vertex => {
        corners["corner " + index] = vertex;
        index++;
    });
    
    return corners;
}

// Function to create a line segment object (see types.js) from the given corners
function makeSegmentsFromCorners(cornerObject) {
    segments = [];

    for(var i = 0; i < Object.keys(cornerObject).length - 1; i++) {
        let newSegment = Segment(cornerObject["corner " + i].x, cornerObject["corner " + i].y, 
                                 cornerObject["corner " + (i + 1)].x, cornerObject["corner " + (i + 1)].y);
        segments.push(newSegment);
    }
    
    return [...segments];
}

// Function to calculate the angles between mouse cursor and each of the endpoints of the segments
function calculateEndpointAngles(cursor, segment) {
    const { x, y } = cursor;
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
// Each segment contains the endpoints, squared distance between the cursor and
// middle point of segment
function processSegments(cursor, segments) {
    for (var i = 0; i < segments.length; i++) {
        let segment = segments[i];
        calculateEndpointAngles(cursor, segment);
        setBeginningOfSegment(segment);
    }

    return segments;
}

// Function to obtain end points of a given segment
function getSegmentEndpoints(segment) {
    return [segment.p1, segment.p2];
}

// Function to create a segment from a given list of polygon and 
// create the associated line segments, with all the necessary information
// (see types.js)
function segmentatePolygon(polygonPoints, cursorPoint) {
    const segments = makeSegmentsFromCorners(getCorners(polygonPoints));

    const processedSegments = processSegments(cursorPoint, segments);

    const endpoints = flatMap(getSegmentEndpoints, processedSegments);

    return endpoints;
}