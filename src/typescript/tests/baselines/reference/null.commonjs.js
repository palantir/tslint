var x = null;
var y = 3 + x;
var z = 3 + null;
var C = (function () {
    function C() {
    }
    return C;
})();
function f() {
    return null;
    return new C();
}
function g() {
    return null;
    return 3;
}

var w = { x: null, y: 3 };
