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

var C = (function () {
    function C() {
    }
    Object.defineProperty(C.prototype, "x", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    return C;
})();

function foo(test) {
}

var x;
var y;

foo(x);
foo(x + y);
