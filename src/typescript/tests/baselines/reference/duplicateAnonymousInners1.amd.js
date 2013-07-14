var Foo;
(function (Foo) {
    var Helper = (function () {
        function Helper() {
        }
        return Helper;
    })();

    var Inner = (function () {
        function Inner() {
        }
        return Inner;
    })();

    Foo.Outer = 0;
})(Foo || (Foo = {}));

var Foo;
(function (Foo) {
    var Helper = (function () {
        function Helper() {
        }
        return Helper;
    })();
})(Foo || (Foo = {}));
