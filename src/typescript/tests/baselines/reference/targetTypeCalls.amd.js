var fra1 = (function () {
    return function (v) {
        return v;
    };
})();
var fra2 = (function () {
    return function () {
        return 0;
    };
})();

var fra3 = (function () {
    return (function () {
        return function (v) {
            return v;
        };
    })();
})();
var fra4 = (function () {
    return (function () {
        return function (v) {
            return v;
        };
    })();
})();
