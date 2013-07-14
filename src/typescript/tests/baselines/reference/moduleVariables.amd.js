var x = 1;
var M;
(function (M) {
    M.x = 2;
    console.log(M.x);
})(M || (M = {}));

var M;
(function (M) {
    console.log(M.x);
})(M || (M = {}));

var M;
(function (M) {
    var x = 3;
    console.log(x);
})(M || (M = {}));
