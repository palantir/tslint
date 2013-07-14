var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var FooBase = (function () {
    function FooBase(x) {
    }
    FooBase.prototype.bar1 = function () {
    };
    return FooBase;
})();

var Foo = (function (_super) {
    __extends(Foo, _super);
    function Foo(x, y) {
        _super.call(this, x);
    }
    Foo.prototype.bar1 = function () {
    };
    return Foo;
})(FooBase);

var f1 = new Foo("hey");
var f2 = new Foo(0);
var f3 = new Foo(f1);
var f4 = new Foo([f1, f2, f3]);

f1.bar1();
