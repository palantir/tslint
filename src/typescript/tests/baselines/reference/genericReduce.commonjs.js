var a = ["An", "array", "of", "strings"];
var b = a.map(function (s) {
    return s.length;
});
var n1 = b.reduce(function (x, y) {
    return x + y;
});
var n2 = b.reduceRight(function (x, y) {
    return x + y;
});

n1.x = "fail";
n1.toExponential(2);
n2.x = "fail";
n2.toExponential(2);

var n3 = b.reduce(function (x, y) {
    return x + y;
}, "");
n3.toExponential(2);
n3.charAt(0);
