var p = null;

p.then(function (x) {
});
p.then(function (x) {
    return "hello";
}).then(function (x) {
    return x;
});
