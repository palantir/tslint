////[exportEqualsFunction_A.js]
define(["require", "exports"], function(require, exports) {
    function foo() {
        return 0;
    }

    
    return foo;
});

////[exportEqualsFunction_B.js]
define(["require", "exports", "exportEqualsFunction_A"], function(require, exports, __fooFunc__) {
    var fooFunc = __fooFunc__;

    var n = fooFunc();
});
