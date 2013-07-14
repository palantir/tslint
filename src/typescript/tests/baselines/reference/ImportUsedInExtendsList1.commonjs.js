var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var foo = require('base');
var Sub = (function (_super) {
    __extends(Sub, _super);
    function Sub() {
        _super.apply(this, arguments);
    }
    return Sub;
})(foo.Super);

