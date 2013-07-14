var A;
(function (A) {
    var b = B;
    var c = C;
})(A || (A = {}));

var B;
(function (B) {
    var a = A;
    var B = (function () {
        function B() {
        }
        return B;
    })();
    B.B = B;
})(B || (B = {}));

var C;
(function (C) {
    var a = A;
    function hello() {
        return null;
    }
})(C || (C = {}));
