var C1 = (function () {
    function C1() {
        this.get = 1;
    }
    return C1;
})();
var C2 = (function () {
    function C2() {
    }
    return C2;
})();
var C3 = (function () {
    function C3() {
    }
    C3.prototype.set = function (x) {
        return x + 1;
    };
    return C3;
})();
var C4 = (function () {
    function C4() {
        this.get = true;
    }
    return C4;
})();
var C5 = (function () {
    function C5() {
        this.set = function () {
            return true;
        };
    }
    C5.prototype.get = function () {
        return true;
    };
    Object.defineProperty(C5.prototype, "t", {
        set: function (x) {
        },
        enumerable: true,
        configurable: true
    });
    return C5;
})();
