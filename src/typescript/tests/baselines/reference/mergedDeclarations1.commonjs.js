function point(x, y) {
    return { x: x, y: y };
}
var point;
(function (point) {
    point.origin = point(0, 0);
    function equals(p1, p2) {
        return p1.x == p2.x && p1.y == p2.y;
    }
    point.equals = equals;
})(point || (point = {}));
var p1 = point(0, 0);
var p2 = point.origin;
var b = point.equals(p1, p2);
