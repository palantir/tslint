var _;
var c2;

var rf1 = function (x) {
    return x.toFixed();
};
var r1a = _.map(c2, function (x) {
    return x.toFixed();
});
var r1b = _.map(c2, rf1);
var r5a = _.map(c2, function (x) {
    return x.toFixed();
});
var r5b = _.map(c2, rf1);
