define(["require", "exports"], function(require, exports) {
    var foo = exports.m1;

    var foo = (function () {
        function foo() {
        }
        return foo;
    })();
});
