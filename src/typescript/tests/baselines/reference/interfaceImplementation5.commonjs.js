var C1 = (function () {
    function C1() {
    }
    Object.defineProperty(C1.prototype, "getset1", {
        get: function () {
            return 1;
        },
        enumerable: true,
        configurable: true
    });
    return C1;
})();

var C2 = (function () {
    function C2() {
    }
    Object.defineProperty(C2.prototype, "getset1", {
        set: function (baz) {
        },
        enumerable: true,
        configurable: true
    });
    return C2;
})();

var C3 = (function () {
    function C3() {
    }
    Object.defineProperty(C3.prototype, "getset1", {
        get: function () {
            return 1;
        },
        set: function (baz) {
        },
        enumerable: true,
        configurable: true
    });
    return C3;
})();

var C4 = (function () {
    function C4() {
    }
    Object.defineProperty(C4.prototype, "getset1", {
        get: function () {
            var x;
            return x;
        },
        enumerable: true,
        configurable: true
    });
    return C4;
})();

var C5 = (function () {
    function C5() {
    }
    Object.defineProperty(C5.prototype, "getset1", {
        set: function (baz) {
        },
        enumerable: true,
        configurable: true
    });
    return C5;
})();

var C6 = (function () {
    function C6() {
    }
    Object.defineProperty(C6.prototype, "getset1", {
        get: function () {
            var x;
            return x;
        },
        set: function (baz) {
        },
        enumerable: true,
        configurable: true
    });
    return C6;
})();
