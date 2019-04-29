// Function to obtain the triangle points to be used to draw a visibility triangle
// It is just firing two rays from origin with angles: angle1 and angle2 and 
// find the intersection points from those two rays with the segment, and 
// those two points and the point of interest will be the triangle
function getTrianglePoints(origin, angle1, angle2, segment) {
    const p1 = origin;
    const p2 = Point(origin.x + Math.cos(angle1), origin.y + Math.sin(angle1));  
    const p3 = Point(segment.p1.x, segment.p1.y);
    const p4 = Point(segment.p2.x, segment.p2.y);

    const tBeginPoint = lineIntersection(p3, p4, p1, p2);
  
    p2.x = origin.x + Math.cos(angle2);
    p2.y = origin.y + Math.sin(angle2);
  
    const tEndPoint = lineIntersection(p3, p4, p1, p2);
  
    return [tBeginPoint, tEndPoint];
}

// Function to calculate the visibility, which returns visibility triangle points.
// There are two passes. In the first pass, openSegments array will be populated as 
// the ray from point object hits the starting endpoint, and removed if it hits non starting
// end point. As the array of open segments is populated, its contents are also sorted 
// based on their proximity to the point object. In the second one, segments continue
// to be collected and checked which one is in front of which one, forming the triangle points array
function calculateVisibility(origin, endpoints) {
    let openSegments = [];
    let outputTrianglePoints = [];
    let beginAngle = 0;
  
    // Sort the endpoints in terms of their angles
    endpoints.sort(endpointAngleComparison);
  
    for(let pass = 0; pass < 2; pass += 1) {
        for (let i = 0; i < endpoints.length; i += 1) {
            let endpoint = endpoints[i];
            let openSegment = openSegments[0];
            
            if (endpoint.beginsSegment) {
                // If segment begins with the endpoint
                let index = 0
                let segment = openSegments[index];

                // While segment is not null and segment that current 
                // endpoint has is in front of the segment
                while (segment && segmentInFrontOf(endpoint.segment, segment, origin)) {
                    // Increment index
                    index += 1;
                    
                    // Check other segments if any left in the array
                    segment = openSegments[index]
                }

                // Sorting in terms of the distance between segments to the point
                if (!segment) {
                    // If segment is null, put the endpoint.segment at the end of the array
                    openSegments.push(endpoint.segment);
                } else {
                    // If segment is null, put the endpoint.segment in array at the index
                    openSegments.splice(index, 0, endpoint.segment);
                }
            } else {
                // If segment doesn't begin with the endpoint
                // Check if there is already the same segment as 
                // the endpoint's segment. If so, remove it
                let index = openSegments.indexOf(endpoint.segment)
                if (index > -1) {
                    openSegments.splice(index, 1);
                }
            }
            
            if (openSegment !== openSegments[0]) {
                // If second pass, obtain triangle points as well
                if (pass === 1) {
                    let trianglePoints = getTrianglePoints(origin, beginAngle, endpoint.angle, openSegment);
                    outputTrianglePoints.push(trianglePoints);
                }
                beginAngle = endpoint.angle;
            }
        }
        
    }
    return outputTrianglePoints;
}