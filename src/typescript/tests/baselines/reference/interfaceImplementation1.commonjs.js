var C1 = (function () {
    function C1() {
    }
    C1.prototype.iFn = function (n, s) {
    };
    return C1;
})();

var C2 = (function () {
    function C2() {
        this.x = 1;
    }
    return C2;
})();

var a = function () {
    return new C2();
};
new a();

var c;
c[5];
c["foo"];
