////[exportEqualsClass_A.js]
define(["require", "exports"], function(require, exports) {
    var C = (function () {
        function C() {
            this.p = 0;
        }
        return C;
    })();

    
    return C;
});

////[exportEqualsClass_B.js]
define(["require", "exports", "exportEqualsClass_A"], function(require, exports, __D__) {
    var D = __D__;

    var d = new D();
    var x = d.p;
});
