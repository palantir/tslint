var A;
(function (A) {
    (function (B) {
        B.x = 1;
    })(A.B || (A.B = {}));
    var B = A.B;
})(A || (A = {}));

var AA;
(function (AA) {
    (function (B) {
        B.x = 1;
    })(AA.B || (AA.B = {}));
    var B = AA.B;
})(AA || (AA = {}));

var tmpOK = AA.B.x;

var tmpError = A.B.x;

var A;
(function (A) {
    (function (B) {
        (function (C) {
            C.x = 1;
        })(B.C || (B.C = {}));
        var C = B.C;
    })(A.B || (A.B = {}));
    var B = A.B;
})(A || (A = {}));

var M;
(function (M) {
    var X1 = A;

    var X2 = A.B;

    var X3 = A.B.C;
})(M || (M = {}));
