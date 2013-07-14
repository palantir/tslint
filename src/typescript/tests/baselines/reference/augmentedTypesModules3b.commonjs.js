var m3b = (function () {
    function m3b() {
    }
    m3b.prototype.foo = function () {
    };
    return m3b;
})();
var m3b;
(function (m3b) {
    var y = 2;
})(m3b || (m3b = {}));

var m3c = (function () {
    function m3c() {
    }
    m3c.prototype.foo = function () {
    };
    return m3c;
})();
var m3c;
(function (m3c) {
    m3c.y = 2;
})(m3c || (m3c = {}));

var m3d;
(function (m3d) {
    m3d.y = 2;
})(m3d || (m3d = {}));

var m3e;
(function (m3e) {
    m3e.y = 2;
})(m3e || (m3e = {}));

var m3g;
(function (m3g) {
    var C = (function () {
        function C() {
        }
        C.prototype.foo = function () {
        };
        return C;
    })();
    m3g.C = C;
})(m3g || (m3g = {}));
