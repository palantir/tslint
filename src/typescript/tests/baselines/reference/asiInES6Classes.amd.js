var Foo = (function () {
    function Foo() {
        this.defaults = {
            done: false
        };
    }
    Foo.prototype.bar = function () {
        return 3;
    };
    return Foo;
})();
