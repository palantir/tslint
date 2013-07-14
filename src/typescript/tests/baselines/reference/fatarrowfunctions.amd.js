function foo(x) {
    return x();
}

foo(function (x, y, z) {
    return x + y + z;
});
foo(function (x, y, z) {
    return x + y + z;
});
foo(function (x, y, z) {
    return x + y + z;
});
foo(function (x, y, z) {
    return x + y + z;
});
foo(function (x, y, z) {
    return x + y + z;
});
foo(function () {
    return 0;
});

foo(function (x, y, z) {
    return x + y + z;
});
foo(function (x, y, z) {
    return x + y + z;
});
foo(function (x, y, z) {
    return x + y + z;
});
foo(function (x, y, z) {
    return x + y + z;
});
foo(function (x, y, z) {
    return x + y + z;
});
foo(function () {
    return 0;
});

foo((function (x) {
    return x;
}));

foo(function (x) {
    return x * x;
});

var y = function (x) {
    return x * x;
};
var z = function (x) {
    return x * x;
};

var w = function () {
    return 3;
};

function ternaryTest(isWhile) {
    var f = isWhile ? function (n) {
        return n > 0;
    } : function (n) {
        return n === 0;
    };
}

var messenger = {
    message: "Hello World",
    start: function () {
        var _this = this;
        setTimeout(function () {
            _this.message.toString();
        }, 3000);
    }
};
