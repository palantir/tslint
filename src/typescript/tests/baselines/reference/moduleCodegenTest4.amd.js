define(["require", "exports"], function(require, exports) {
    (function (Baz) {
        Baz.x = "hello";
    })(exports.Baz || (exports.Baz = {}));
    var Baz = exports.Baz;

    Baz.x = "goodbye";
    void 0;
});
