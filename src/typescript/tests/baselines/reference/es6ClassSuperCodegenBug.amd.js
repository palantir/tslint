var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var A = (function () {
    function A(str1, str2) {
    }
    return A;
})();
var B = (function (_super) {
    __extends(B, _super);
    function B() {
        if (true) {
            _super.call(this, 'a1', 'b1');
        } else {
            _super.call(this, 'a2', 'b2');
        }
    }
    return B;
})(A);
