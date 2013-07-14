var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    var A = (function () {
        function A(ctor) {
        }
        return A;
    })();
    exports.A = A;

    var B = (function (_super) {
        __extends(B, _super);
        function B(element, url) {
            _super.call(this, element);
            this.p1 = element;
            this.p2 = url;
        }
        return B;
    })(A);
    exports.B = B;

    var reg;
    reg.register(B);
});
