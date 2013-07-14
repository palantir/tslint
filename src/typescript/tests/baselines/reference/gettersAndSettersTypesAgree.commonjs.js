var C = (function () {
    function C() {
    }
    Object.defineProperty(C.prototype, "Foo", {
        get: function () {
            return "foo";
        },
        set: function (foo) {
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(C.prototype, "Bar", {
        get: function () {
            return "foo";
        },
        set: function (bar) {
        },
        enumerable: true,
        configurable: true
    });
    return C;
})();

var o1 = { get Foo() {
        return 0;
    }, set Foo(val) {
    } };
var o2 = { get Foo() {
        return 0;
    }, set Foo(val) {
    } };
