var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var M;
(function (M) {
    var C1 = (function () {
        function C1() {
        }
        return C1;
    })();
    M.C1 = C1;
    var A = (function () {
        function A() {
        }
        return A;
    })();
    M.A = A;
    var B = (function (_super) {
        __extends(B, _super);
        function B() {
            _super.apply(this, arguments);
        }
        return B;
    })(C1);
    M.B = B;
    var D = (function () {
        function D() {
        }
        D.prototype._subscribe = function (viewModel) {
            var f = function (newValue) {
            };

            var v = viewModel.value;

            v.subscribe(f);
            v.subscribe(function (newValue) {
            });
        };
        return D;
    })();
    M.D = D;
})(M || (M = {}));
