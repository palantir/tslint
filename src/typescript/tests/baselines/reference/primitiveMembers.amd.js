var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var x = 5;
var r = /yo/;
r.source;

x.toBAZ();
x.toString();

var n = 0;
var N;

n = N;
N = n;

var o = {};
var f = function (x) {
    return x.length;
};
var r2 = /./g;
var n2 = 34;
var s = "yo";
var b = true;

var n3 = 5 || {};

var baz = (function () {
    function baz() {
    }
    baz.prototype.bar = function () {
    };
    return baz;
})();
var foo = (function (_super) {
    __extends(foo, _super);
    function foo() {
        _super.apply(this, arguments);
    }
    foo.prototype.bar = function () {
        return undefined;
    };
    return foo;
})(baz);
