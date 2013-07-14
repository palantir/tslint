var Foo = (function () {
    function Foo(x) {
    }
    Foo.prototype.bar1 = function (a) {
    };
    return Foo;
})();

var f1 = new Foo("hey");

f1.bar1("a");
Foo();
Foo("s");
