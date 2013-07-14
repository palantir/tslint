var A;
(function (A) {
    (function (B) {
        var C = (function () {
            function C() {
            }
            return C;
        })();
        B.C = C;
    })(A.B || (A.B = {}));
    var B = A.B;
})(A || (A = {}));

var c = new A.B.C();
