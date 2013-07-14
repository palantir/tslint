var Foo = (function () {
    function Foo() {
        this.pubProp = 0;
        this.privProp = 0;
    }
    Foo.prototype.pubMeth = function () {
        this.privMeth();
    };
    Foo.prototype.privMeth = function () {
    };
    return Foo;
})();

var f = new Foo();
f.privMeth();
f.privProp;

f.pubMeth();
f.pubProp;

var M;
(function (M) {
    var C = (function () {
        function C() {
            this.pub = 0;
            this.priv = 1;
        }
        return C;
    })();
    M.C = C;
    M.V = 0;
})(M || (M = {}));

var c = new M.C();

c.pub;
c.priv;
