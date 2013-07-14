var Collection = (function () {
    function Collection() {
    }
    Collection.prototype.add = function (x) {
    };
    return Collection;
})();

var utils;
var c = new Collection();
var r3 = utils.mapReduce(c, function (x) {
    return 1;
}, function (y) {
    return new Date();
});
var r4 = utils.mapReduce(c, function (x) {
    return 1;
}, function (y) {
    return new Date();
});
var f1 = function (x) {
    return 1;
};
var f2 = function (y) {
    return new Date();
};
var r5 = utils.mapReduce(c, f1, f2);
