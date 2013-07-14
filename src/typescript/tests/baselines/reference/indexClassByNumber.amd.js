var foo = (function () {
    function foo() {
    }
    return foo;
})();

var f = new foo();

f[0] = 4;
