var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Bar = (function () {
    function Bar(n) {
    }
    Bar.prototype.prop1 = function (x) {
        return x;
    };
    return Bar;
})();

var Foo = (function (_super) {
    __extends(Foo, _super);
    function Foo(x, y, z) {
        if (typeof z === "undefined") { z = 0; }
        _super.call(this, x);
        this.y = y;
        this.z = z;
        this.gar = 0;
        this.zoo = "zoo";
        this.x = x;
        this.gar = 5;
    }
    Foo.prototype.bar = function () {
        return 0;
    };

    Foo.prototype.boo = function (x) {
        return x;
    };

    Foo.statVal = 0;
    return Foo;
})(Bar);

var f = new Foo();
