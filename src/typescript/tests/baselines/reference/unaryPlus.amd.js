var a = +1;
var b = +("");
var E;
(function (E) {
    E[E["some"] = 0] = "some";
    E[E["thing"] = 1] = "thing";
})(E || (E = {}));
;
var c = +E.some;

var x = +"3";
var y = -"3";
var z = ~"3";
