var M;
(function (M) {
    function f(y) {
        return x + y;
    }
    M.f = f;
})(M || (M = {}));

var x = 10;
M.f(3);
