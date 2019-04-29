// Function to obtain the triangle points to be used to draw a visibility triangle
function getTrianglePoints(origin, angle1, angle2, segment) {
    const p1 = origin;
    const p2 = Point(origin.x + Math.cos(angle1), origin.y + Math.sin(angle1));
    const p3 = Point(segment.p1.x, segment.p1.y);
    const p4 = Point(segment.p2.x, segment.p2.y);

    const pBegin = lineIntersection(p3, p4, p1, p2);
  
    p2.x = origin.x + Math.cos(angle2);
    p2.y = origin.y + Math.sin(angle2);
  
    const pEnd = lineIntersection(p3, p4, p1, p2);
  
    return [pBegin, pEnd];
}

// Function to calculate the visibility, which returns visibility triangle points
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