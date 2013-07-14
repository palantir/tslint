var Foo2 = (function () {
    function Foo2() {
        this.x = this.fgoo;
    }
    Foo2.prototype.bar = function () {
        var _this = this;
        this.x;

        var f = function () {
            return _this.x;
        };
    };
    return Foo2;
})();
