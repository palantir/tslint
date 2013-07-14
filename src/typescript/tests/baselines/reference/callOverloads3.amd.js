var Foo = (function () {
    function Foo(x) {
    }
    Foo.prototype.bar1 = function () {
    };
    return Foo;
})();

var f1 = new Foo("hey");

f1.bar1();
Foo();
Foo("s");
