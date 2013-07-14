function delegate(instance, method, data) {
    return function () {
    };
}

var Foo = (function () {
    function Foo() {
    }
    Foo.prototype.Bar = function () {
        delegate(this, function (source, args2) {
            var a = source.node;
            var b = args2.node;
        });
    };
    return Foo;
})();
