define(["require", "exports"], function(require, exports) {
    exports.foo = 3;

    function log(n) {
        return n;
    }

    void log(exports.foo).toString();
});
