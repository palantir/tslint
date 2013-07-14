function f() {
    var x = 1;
}

var y = f();
var why = f();
var w;
w = f();

var C = (function () {
    function C() {
    }
    C.prototype.g = function () {
    };
    return C;
})();

var z = new C().g();
var N = new f();
