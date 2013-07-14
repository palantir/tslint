var Foo = (function () {
    function Foo() {
        this.pvar = 0;
        var n = this.pvar;
    }
    Foo.prototype.meth = function () {
        var q = this.pvar;
    };
    return Foo;
})();
