var Foo = (function () {
    function Foo() {
    }
    Object.defineProperty(Foo.prototype, "bar", {
        get: function () {
            return this._bar;
        },
        set: function (thing) {
            this._bar = thing;
        },
        enumerable: true,
        configurable: true
    });
    return Foo;
})();
