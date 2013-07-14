var Foo1 = (function () {
    function Foo1() {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            args[_i] = arguments[_i + 0];
        }
    }
    return Foo1;
})();

var Foo2 = (function () {
    function Foo2(args) {
        this.args = args;
    }
    return Foo2;
})();

var Foo3 = (function () {
    function Foo3(__missing) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            args[_i] = arguments[_i + 1];
        }
        this.__missing = __missing;
    }
    return Foo3;
})();
