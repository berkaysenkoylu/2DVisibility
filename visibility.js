//
function getTrianglePoints(origin, angle1, angle2, segment) {
    const p1 = origin;
    const p2 = Point(origin.x + Math.cos(angle1), origin.y + Math.sin(angle1));
    const p3 = Point(0, 0);
    const p4 = Point(0, 0);
  
    if (segment) {
        p3.x = segment.p1.x;
        p3.y = segment.p1.y;
        p4.x = segment.p2.x;
        p4.y = segment.p2.y;
    } else {
        p3.x = origin.x + Math.cos(angle1) * 200;
        p3.y = origin.y + Math.sin(angle1) * 200;
        p4.x = origin.x + Math.cos(angle2) * 200;
        p4.y = origin.y + Math.sin(angle2) * 200;
    }
  
    const pBegin = lineIntersection(p3, p4, p1, p2);
  
    p2.x = origin.x + Math.cos(angle2);
    p2.y = origin.y + Math.sin(angle2);
  
    const pEnd = lineIntersection(p3, p4, p1, p2);
  
    return [pBegin, pEnd];
}

//
function calculateVisibility(origin, endpoints) {
    let openSegments = [];
    let output = [];
    let beginAngle = 0;
  
    endpoints.sort(endpointComparison);
  
    for(let pass = 0; pass < 2; pass += 1) {
        for (let i = 0; i < endpoints.length; i += 1) {
            let endpoint = endpoints[i];
            let openSegment = openSegments[0];
            
            if (endpoint.beginsSegment) {
                let index = 0
                let segment = openSegments[index];

                while (segment && segmentInFrontOf(endpoint.segment, segment, origin)) {
                    index += 1;
                    segment = openSegments[index]
                }

                if (!segment) {
                    openSegments.push(endpoint.segment);
                } else {
                    openSegments.splice(index, 0, endpoint.segment);
                }
            } else {
                let index = openSegments.indexOf(endpoint.segment)
                if (index > -1) {
                    openSegments.splice(index, 1);
                }
            }
            
            if (openSegment !== openSegments[0]) {
                if (pass === 1) {
                    let trianglePoints = getTrianglePoints(origin, beginAngle, endpoint.angle, openSegment);
                    output.push(trianglePoints);
                }
                beginAngle = endpoint.angle;
            }
        }
    }
    return output;
}

// Function to get the intersection of two line that includes given points
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
function leftOf(segment, point) {
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

function segmentInFrontOf(segmentA, segmentB, relativePoint) {
    const A1 = leftOf(segmentA, interpolate(segmentB.p1, segmentB.p2, 0.01));
    const A2 = leftOf(segmentA, interpolate(segmentB.p2, segmentB.p1, 0.01));
    const A3 = leftOf(segmentA, relativePoint);
    const B1 = leftOf(segmentB, interpolate(segmentA.p1, segmentA.p2, 0.01));
    const B2 = leftOf(segmentB, interpolate(segmentA.p2, segmentA.p1, 0.01));
    const B3 = leftOf(segmentB, relativePoint);

    if (B1 === B2 && B2 !== B3) return true;
    if (A1 === A2 && A2 === A3) return true;
    if (A1 === A2 && A2 !== A3) return false;
    if (B1 === B2 && B2 === B3) return false;

    return false;
}

function endpointComparison(pointA, pointB) {
    if (pointA.angle > pointB.angle) return 1;
    if (pointA.angle < pointB.angle) return -1;
    if (!pointA.beginsSegment && pointB.beginsSegment) return 1;
    if (pointA.beginsSegment && !pointB.beginsSegment) return -1;
    return 0;
}