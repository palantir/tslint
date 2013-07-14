var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var C1 = (function () {
    function C1() {
    }
    C1.prototype.IM1 = function () {
        return null;
    };
    C1.prototype.C1M1 = function () {
        return null;
    };
    return C1;
})();
var C2 = (function (_super) {
    __extends(C2, _super);
    function C2() {
        _super.apply(this, arguments);
    }
    C2.prototype.C2M1 = function () {
        return null;
    };
    return C2;
})(C1);

var C3 = (function () {
    function C3() {
    }
    C3.prototype.CM3M1 = function () {
        return 3;
    };
    return C3;
})();

var a1 = null;
var c1 = new C1();
var i1 = c1;
var c2 = new C2();
var c3 = new C3();
var o1 = { one: 1 };
var f1 = function () {
    return new C1();
};

var arr_any = [];
var arr_i1 = [];
var arr_c1 = [];
var arr_c2 = [];
var arr_i1_2 = [];
var arr_c1_2 = [];
var arr_c2_2 = [];
var arr_c3 = [];

var i1_error = [];
var c1_error = [];
var c2_error = [];
var c3_error = [];

arr_any = arr_i1;
arr_any = arr_c1;
arr_any = arr_c2;
arr_any = arr_c3;

arr_i1 = arr_i1;
arr_i1 = arr_c1;
arr_i1 = arr_c2;
arr_i1 = arr_c3;

arr_c1 = arr_c1;
arr_c1 = arr_c2;
arr_c1 = arr_i1;
arr_c1 = arr_c3;

arr_c2 = arr_c2;
arr_c2 = arr_c1;
arr_c2 = arr_i1;
arr_c2 = arr_c3;

arr_c3 = arr_c2_2;
arr_c3 = arr_c1_2;
arr_c3 = arr_i1_2;

arr_any = f1;
arr_any = o1;
arr_any = a1;
arr_any = c1;
arr_any = c2;
arr_any = c3;
arr_any = i1;
