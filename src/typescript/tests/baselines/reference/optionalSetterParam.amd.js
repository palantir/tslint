var foo = (function () {
    function foo() {
    }
    Object.defineProperty(foo.prototype, "bar", {
        set: function (param) {
        },
        enumerable: true,
        configurable: true
    });
    return foo;
})();
