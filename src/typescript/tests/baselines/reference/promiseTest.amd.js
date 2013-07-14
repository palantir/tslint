var p = null;
var p2 = p.then(function (x) {
    return p;
});

var x = p2.data;
