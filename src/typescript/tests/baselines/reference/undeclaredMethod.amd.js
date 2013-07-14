var M;
(function (M) {
    var C = (function () {
        function C() {
        }
        C.prototype.salt = function () {
        };
        return C;
    })();
    M.C = C;
})(M || (M = {}));

var c = new M.C();

c.salt();
c.saltbar();
