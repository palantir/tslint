var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Base = (function () {
    function Base(b) {
        this.b = b;
    }
    return Base;
})();
var Super = (function (_super) {
    __extends(Super, _super);
    function Super() {
        var _this = this;
        _super.call(this, (function () {
            return _this;
        })());
    }
    return Super;
})(Base);
