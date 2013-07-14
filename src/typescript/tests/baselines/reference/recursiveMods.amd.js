define(["require", "exports"], function(require, exports) {
    (function (Foo) {
        var C = (function () {
            function C() {
            }
            return C;
        })();
        Foo.C = C;
    })(exports.Foo || (exports.Foo = {}));
    var Foo = exports.Foo;

    (function (Foo) {
        function Bar() {
            if (true) {
                return Bar();
            }
            return new Foo.C();
        }

        function Baz() {
            var c = Baz();
            return Bar();
        }

        function Gar() {
            var c = Baz();
            return;
        }
    })(exports.Foo || (exports.Foo = {}));
    var Foo = exports.Foo;
});
