var IFoo = (function () {
    function IFoo() {
    }
    IFoo.prototype.foo = function (x) {
        return null;
    };
    return IFoo;
})();

var IntFooBad = (function () {
    function IntFooBad() {
    }
    IntFooBad.prototype.foo = function (x) {
        return null;
    };
    return IntFooBad;
})();

var StringFoo2 = (function () {
    function StringFoo2() {
    }
    StringFoo2.prototype.foo = function (x) {
        return null;
    };
    return StringFoo2;
})();

var StringFoo3 = (function () {
    function StringFoo3() {
    }
    StringFoo3.prototype.foo = function (x) {
        return null;
    };
    return StringFoo3;
})();
