////[exportEqualsEnum_A.js]
define(["require", "exports"], function(require, exports) {
    var E;
    (function (E) {
        E[E["A"] = 0] = "A";
        E[E["B"] = 1] = "B";
        E[E["C"] = 2] = "C";
    })(E || (E = {}));

    
    return E;
});

////[exportEqualsEnum_B.js]
define(["require", "exports", "exportEqualsEnum_A"], function(require, exports, __EnumE__) {
    var EnumE = __EnumE__;

    var a = EnumE.A;
    var b = EnumE.B;
    var c = EnumE.C;
});
