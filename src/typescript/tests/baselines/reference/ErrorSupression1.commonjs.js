var Foo = (function () {
    function Foo() {
    }
    Foo.bar = function () {
        return "x";
    };
    return Foo;
})();

var baz = Foo.b;

baz.concat("y");
