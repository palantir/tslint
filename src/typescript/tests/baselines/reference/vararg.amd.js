var M;
(function (M) {
    var C = (function () {
        function C() {
        }
        C.prototype.f = function (x) {
            var rest = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                rest[_i] = arguments[_i + 1];
            }
            var sum = 0;
            for (var i = 0; i < rest.length; i++) {
                sum += rest[i];
            }
            result += (x + ": " + sum);
            return result;
        };

        C.prototype.fnope = function (x) {
            var rest = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                rest[_i] = arguments[_i + 1];
            }
        };

        C.prototype.fonly = function () {
            var rest = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                rest[_i] = arguments[_i + 0];
            }
            builder = "";
            for (var i = 0; i < rest.length; i++) {
                builder += rest[i];
            }
            return builder;
        };
        return C;
    })();
    M.C = C;
})(M || (M = {}));

var x = new M.C();
var result = "";
result += x.f(x, 3, 3);
result += x.f(3, "hello", 3);
result += x.f("hello", 3, 3, 3, 3, 3);
result += x.f("hello");
result += x.fonly(3);
result += x.fonly(x);
result += x.fonly("a");
result += x.fonly("a", "b", "c", "d");
