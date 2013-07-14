var m1 = 1;

var m1a;
(function (m1a) {
    var y = 2;
})(m1a || (m1a = {}));
var m1a = 1;

var m1b;
(function (m1b) {
    m1b.y = 2;
})(m1b || (m1b = {}));
var m1b = 1;

var m1c = 1;

var m1d;
(function (m1d) {
    var I = (function () {
        function I() {
        }
        I.prototype.foo = function () {
        };
        return I;
    })();
    m1d.I = I;
})(m1d || (m1d = {}));
var m1d = 1;
