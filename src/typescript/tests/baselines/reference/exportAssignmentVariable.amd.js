////[exportEqualsVar_A.js]
define(["require", "exports"], function(require, exports) {
    var x = 0;

    
    return x;
});

////[exportEqualsVar_B.js]
define(["require", "exports", "exportEqualsVar_A"], function(require, exports, __y__) {
    var y = __y__;

    var n = y;
});
