function x1(a, cb) {
    cb('hi');
    cb('bye');
    var hm = 'hm';
    cb(hm);
    cb('uh');
    cb(1);
}

var cb = function (x) {
    return 1;
};

x1(1, cb);
x1(1, function (x) {
    return 1;
});
x1(1, function (x) {
    return 1;
});
