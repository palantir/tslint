function foo(x, y, z) {
    if (typeof y === "undefined") { y = false; }
    if (typeof z === "undefined") { z = 0; }
}

var CCC = (function () {
    function CCC() {
    }
    CCC.prototype.foo = function (x, y, z) {
        if (typeof y === "undefined") { y = false; }
        if (typeof z === "undefined") { z = 0; }
    };
    CCC.foo2 = function (x, y, z) {
        if (typeof y === "undefined") { y = false; }
        if (typeof z === "undefined") { z = 0; }
    };
    return CCC;
})();

var a = (x ?  = 0 : );
function (__missing) {
    return 1;
};
var b = function (x, y) {
    if (typeof y === "undefined") { y = 2; }
    x;
};
