var Foo = (function () {
    function Foo() {
        this.x = "hello";
    }
    Foo.prototype.bar = function () {
        function inner() {
            var _this = this;
            this.y = "hi";
            var f = function () {
                return _this.y;
            };
        }
    };
    return Foo;
})();

function test() {
    var _this = this;
    var x = function () {
        (function () {
            return _this;
        })();
        _this;
    };
}
