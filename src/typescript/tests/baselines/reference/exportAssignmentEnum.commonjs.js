////[exportEqualsEnum_A.js]
var E;
(function (E) {
    E[E["A"] = 0] = "A";
    E[E["B"] = 1] = "B";
    E[E["C"] = 2] = "C";
})(E || (E = {}));


module.exports = E;


////[exportEqualsEnum_B.js]
var EnumE = require("./exportEqualsEnum_A");

var a = EnumE.A;
var b = EnumE.B;
var c = EnumE.C;

