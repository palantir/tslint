var Bugs;
(function (Bugs) {
    var A = (function () {
        function A() {
        }
        return A;
    })();

    function bug2(message) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            args[_i] = arguments[_i + 1];
        }
        var result = message.replace(/\{(\d+)\}/g, function (match, rest) {
            var index = rest[0];
            return typeof args[index] !== 'undefined' ? args[index] : match;
        });
        return result;
    }
})(Bugs || (Bugs = {}));

function bug3(f) {
    return f("s");
}

function fprime(x) {
    return x;
}

bug3(fprime);

bug3(function (x) {
    return x;
});
