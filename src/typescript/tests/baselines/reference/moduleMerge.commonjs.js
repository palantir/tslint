var A;
(function (A) {
    var B = (function () {
        function B() {
        }
        B.prototype.Hello = function () {
            return "from private B";
        };
        return B;
    })();
})(A || (A = {}));

var A;
(function (A) {
    var B = (function () {
        function B() {
        }
        B.prototype.Hello = function () {
            return "from export B";
        };
        return B;
    })();
    A.B = B;
})(A || (A = {}));
