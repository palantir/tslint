var foo;
(function (foo) {
    var Provide = (function () {
        function Provide() {
        }
        return Provide;
    })();
    foo.Provide = Provide;
    (function (bar) {
        (function (baz) {
            var boo = (function () {
                function boo() {
                }
                return boo;
            })();
            baz.boo = boo;
        })(bar.baz || (bar.baz = {}));
        var baz = bar.baz;
    })(foo.bar || (foo.bar = {}));
    var bar = foo.bar;
})(foo || (foo = {}));

var provide = foo;
var booz = foo.bar.baz;
var beez = foo.bar;

var m = no;
var m2 = no.mod;
var n = ;
5;
var o = ;
"s";
var q = ;
null;
var r = undefined;

var p = new provide.Provide();

function use() {
    beez.baz.boo;
    var p1;
    var p2;
    var p3;
    var p22 = new provide.Provide();
}
