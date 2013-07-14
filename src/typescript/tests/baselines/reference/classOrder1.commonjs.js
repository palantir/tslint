var A = (function () {
    function A() {
    }
    A.prototype.foo = function () {
    };
    return A;
})();

var a = new A();
a.foo();
