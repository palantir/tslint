var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var C1 = (function () {
    function C1(v, p) {
        if (typeof v === "undefined") { v = 1; }
        if (typeof p === "undefined") { p = 0; }
        this.n = 0;
    }
    C1.prototype.C1M1 = function () {
        return 0;
    };

    C1.prototype.C1M2 = function (C1M2A1) {
        return C1M2A1;
    };

    C1.prototype.C1M3 = function (C1M3A1, C1M3A2) {
        if (typeof C1M3A1 === "undefined") { C1M3A1 = 0; }
        if (typeof C1M3A2 === "undefined") { C1M3A2 = C1M3A1; }
        return C1M3A1 + C1M3A2;
    };

    C1.prototype.C1M4 = function (C1M4A1, C1M4A2) {
        return C1M4A1 + C1M4A2;
    };

    C1.prototype.C1M5 = function (C1M5A1, C1M5A2, C1M5A3) {
        if (typeof C1M5A2 === "undefined") { C1M5A2 = 0; }
        return C1M5A1 + C1M5A2;
    };

    C1.prototype.C1M5 = function (C1M5A1, C1M5A2, C1M5A3) {
        if (typeof C1M5A2 === "undefined") { C1M5A2 = 0; }
        return C1M5A1 + C1M5A2;
    };
    return C1;
})();

var C2 = (function (_super) {
    __extends(C2, _super);
    function C2(v2) {
        if (typeof v2 === "undefined") { v2 = 6; }
        _super.call(this, v2);
    }
    return C2;
})(C1);

function F1() {
    return 0;
}
function F2(F2A1) {
    return F2A1;
}
function F3(F3A1, F3A2) {
    if (typeof F3A1 === "undefined") { F3A1 = 0; }
    if (typeof F3A2 === "undefined") { F3A2 = F3A1; }
    return F3A1 + F3A2;
}
function F4(F4A1, F4A2) {
    return F4A1 + F4A2;
}

var L1 = function () {
    return 0;
};
var L2 = function (L2A1) {
    return L2A1;
};
var L3 = function (L3A1, L3A2) {
    if (typeof L3A1 === "undefined") { L3A1 = 0; }
    if (typeof L3A2 === "undefined") { L3A2 = L3A1; }
    return L3A1 + L3A2;
};
var L4 = function (L4A1, L4A2) {
    return L4A1 + L4A2;
};

var c1o1 = new C1(5);
var i1o1 = new C1(5);

c1o1.C1M1();
var f1v1 = F1();
var l1v1 = L1();

c1o1.C1M2(1);
i1o1.C1M2(1);
var f2v1 = F2(1);
var l2v1 = L2(1);

c1o1.C1M3(1, 2);
i1o1.C1M3(1, 2);
var f3v1 = F3(1, 2);
var l3v1 = L3(1, 2);

c1o1.C1M4(1, 2);
i1o1.C1M4(1, 2);
var f4v1 = F4(1, 2);
var l4v1 = L4(1, 2);

c1o1.C1M3(1);
i1o1.C1M3(1);
var f3v2 = F3(1);
var l3v2 = L3(1);

c1o1.C1M3();
i1o1.C1M3();
var f3v3 = F3();
var l3v3 = L3();

c1o1.C1M4(1);
i1o1.C1M4(1);
var f4v2 = F4(1);
var l4v2 = L4(1);

c1o1.C1M1(1);
i1o1.C1M1(1);
F1(1);
L1(1);
c1o1.C1M2();
i1o1.C1M2();
F2();
L2();
c1o1.C1M2(1, 2);
i1o1.C1M2(1, 2);
F2(1, 2);
L2(1, 2);
c1o1.C1M3(1, 2, 3);
i1o1.C1M3(1, 2, 3);
F3(1, 2, 3);
L3(1, 2, 3);
c1o1.C1M4();
i1o1.C1M4();
F4();
L4();

function fnOpt1(id, children, expectedPath, isRoot) {
    if (typeof children === "undefined") { children = []; }
    if (typeof expectedPath === "undefined") { expectedPath = []; }
}
function fnOpt2(id, children, expectedPath, isRoot) {
}
fnOpt1(1, [2, 3], [1], true);
fnOpt2(1, [2, 3], [1], true);
