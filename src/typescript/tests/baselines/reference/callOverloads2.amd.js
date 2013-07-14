var Foo = (function () {
    function Foo(x) {
    }
    Foo.prototype.bar1 = function () {
    };
    return Foo;
})();

function F1(s) {
    return s;
}
function F1(a) {
    return a;
}

var f1 = new Foo("hey");

f1.bar1();
Foo();
