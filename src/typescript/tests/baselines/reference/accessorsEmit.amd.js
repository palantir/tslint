var Result = (function () {
    function Result() {
    }
    return Result;
})();

var Test = (function () {
    function Test() {
    }
    Object.defineProperty(Test.prototype, "Property", {
        get: function () {
            var x = 1;
            return null;
        },
        enumerable: true,
        configurable: true
    });
    return Test;
})();

var Test2 = (function () {
    function Test2() {
    }
    Object.defineProperty(Test2.prototype, "Property", {
        get: function () {
            var x = 1;
            return null;
        },
        enumerable: true,
        configurable: true
    });
    return Test2;
})();
