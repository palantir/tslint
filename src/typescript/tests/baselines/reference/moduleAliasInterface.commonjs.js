var _modes;
(function (_modes) {
    var Mode = (function () {
        function Mode() {
        }
        return Mode;
    })();
    _modes.Mode = Mode;
})(_modes || (_modes = {}));

var editor;
(function (editor) {
    var modes = _modes;

    var i;

    var Bug = (function () {
        function Bug(p1, p2) {
        }
        Bug.prototype.foo = function (p1) {
        };
        return Bug;
    })();
})(editor || (editor = {}));

var modesOuter = _modes;
var editor2;
(function (editor2) {
    var i;

    var Bug = (function () {
        function Bug(p1, p2) {
        }
        return Bug;
    })();

    var Foo;
    (function (Foo) {
        var Bar = (function () {
            function Bar() {
            }
            return Bar;
        })();
        Foo.Bar = Bar;
    })(Foo || (Foo = {}));

    var Bug2 = (function () {
        function Bug2(p1, p2) {
        }
        return Bug2;
    })();
})(editor2 || (editor2 = {}));

var A1;
(function (A1) {
    var A1C1 = (function () {
        function A1C1() {
        }
        return A1C1;
    })();
    A1.A1C1 = A1C1;
})(A1 || (A1 = {}));

var B1;
(function (B1) {
    var A1Alias1 = A1;

    var i;
    var c;
})(B1 || (B1 = {}));
