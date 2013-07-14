var M;
(function (M) {
    var outer;

    function f() {
        var inner = outer;
    }

    var C = (function () {
        function C() {
            var inner = outer;
        }
        return C;
    })();

    var X;
    (function (X) {
        var inner = outer;
    })(X || (X = {}));
})(M || (M = {}));
