var Foo = (function () {
    function Foo() {
        this.x = 1;
    }
    return Foo;
})();

var f = new Foo();

var Foo2 = (function () {
    function Foo2() {
    }
    return Foo2;
})();
var x = 1;

var f2 = new Foo2();
