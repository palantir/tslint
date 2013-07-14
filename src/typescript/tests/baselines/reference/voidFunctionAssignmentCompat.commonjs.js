var fa = function () {
    return 3;
};
fa = function () {
};

var fv = function () {
};
fv = function () {
    return 0;
};

function execAny(callback) {
    return callback(0);
}
execAny(function () {
});

function execVoid(callback) {
    callback(0);
}
execVoid(function () {
    return 0;
});

var fra = function () {
    return function () {
    };
};
var frv = function () {
    return function () {
        return 0;
    };
};

var fra3 = (function () {
    return function (v) {
        return v;
    };
})();
var frv3 = (function () {
    return function () {
        return 0;
    };
})();
