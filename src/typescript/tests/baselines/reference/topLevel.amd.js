var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.move = function (xo, yo) {
        this.x += xo;
        this.y += yo;
        return this;
    };
    Point.prototype.toString = function () {
        return ("(" + this.x + "," + this.y + ")");
    };
    return Point;
})();

var result = "";
result += (new Point(3, 4).move(2, 2));

var M;
(function (M) {
    M.origin = new Point(0, 0);
})(M || (M = {}));

result += (M.origin.move(1, 1));
