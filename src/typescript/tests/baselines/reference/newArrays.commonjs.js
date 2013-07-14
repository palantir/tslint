var M;
(function (M) {
    var Foo = (function () {
        function Foo() {
        }
        return Foo;
    })();
    var Gar = (function () {
        function Gar() {
            this.x = 10;
            this.y = 10;
        }
        Gar.prototype.m = function () {
            this.fa = new Array(this.x * this.y);
        };
        return Gar;
    })();
})(M || (M = {}));
