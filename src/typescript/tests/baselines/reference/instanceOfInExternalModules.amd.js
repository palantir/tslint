define(["require", "exports", "FS"], function(require, exports, __Bar__) {
    var Bar = __Bar__;

    function IsFoo(value) {
        return value instanceof Bar.Foo;
    }
});
