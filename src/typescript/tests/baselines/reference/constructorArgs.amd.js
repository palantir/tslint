var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Super = (function () {
    function Super(value) {
    }
    return Super;
})();

var Sub = (function (_super) {
    __extends(Sub, _super);
    function Sub(options) {
        _super.call(this, options.value);
        this.options = options;
    }
    return Sub;
})(Super);
