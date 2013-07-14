var A = (function () {
    function A() {
        this.foo;
        any;
        this.bar;
        any;
    }
    A.prototype.baz = function () {
        var _this = this;
        this.foo = "foo";

        this.bar = "bar";

        [1, 2].forEach(function (p) {
            return _this.foo;
        });

        [1, 2].forEach(function (p) {
            return _this.bar;
        });
    };
    return A;
})();

var a = new A();

a.baz();
