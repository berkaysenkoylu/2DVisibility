// Point object, which has an x and y coordinate information
const Point = (x, y) => ({x, y});

// Endpoint object:
// point (its x and y coordinate),
// whether or not if a segment begins with this endpoint,
// angle between a point of interest and the endpoint itself
const EndPoint =
    (x, y, beginsSegment, segment, angle) => ({
        ...Point(x, y),
        beginsSegment,
        segment,
        angle
    });

// Segment object
// its endpoints; two points p1(x1, y1) and p2(x2, y2)
// the distance between the median point of its endpoints and 
// the point of interest (in this case; our point object which we move with mouse)
const Segment =
    (x1, y1, x2, y2) => {
        const p1 = EndPoint(x1, y1);
        const p2 = EndPoint(x2, y2);
        const segment = { p1, p2, d: 0 };
    
        p1.segment = segment;
        p2.segment = segment;

        return segment;
    };