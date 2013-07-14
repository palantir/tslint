function makePoint(x, y) {
    return {
        get x() {
            return x;
        },
        get y() {
            return y;
        },
        dist: function () {
            return Math.sqrt(x * x + y * y);
        }
    };
}
;
