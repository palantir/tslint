function () {
    return 1;
};

function (arg) {
    return 2;
};

function (arg) {
    return 2;
};

function (arg) {
    if (typeof arg === "undefined") { arg = 1; }
    return 3;
};

function (arg) {
    return 4;
};

function (arg) {
    return 5;
};

function (arg) {
    if (typeof arg === "undefined") { arg = 0; }
    return 6;
};

function (arg) {
    return 7;
};

function () {
    var arg = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        arg[_i] = arguments[_i + 0];
    }
    return 8;
};

function (arg1, arg2) {
    return 12;
};
function (arg1, arg2) {
    if (typeof arg1 === "undefined") { arg1 = 1; }
    if (typeof arg2 === "undefined") { arg2 = 3; }
    return 13;
};
function (arg1, arg2) {
    return 14;
};
function (arg1, arg2) {
    return 15;
};
function (arg1, arg2) {
    if (typeof arg1 === "undefined") { arg1 = 0; }
    if (typeof arg2 === "undefined") { arg2 = 1; }
    return 16;
};
function (arg1, arg2) {
    return 17;
};
function (arg1) {
    var arg2 = [];
    for (var _i = 0; _i < (arguments.length - 1); _i++) {
        arg2[_i] = arguments[_i + 1];
    }
    return 18;
};
function (arg1, arg2) {
    return 19;
};

(function () {
    return 21;
});
(function (arg) {
    return 22;
});
(function (arg) {
    if (typeof arg === "undefined") { arg = 1; }
    return 23;
});
(function (arg) {
    return 24;
});
(function (arg) {
    return 25;
});
(function (arg) {
    if (typeof arg === "undefined") { arg = 0; }
    return 26;
});
(function (arg) {
    return 27;
});
(function () {
    var arg = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        arg[_i] = arguments[_i + 0];
    }
    return 28;
});

((((function (arg) {
    return 32;
}))));

false ? function () {
    return 41;
} : null;
false ? function (arg) {
    return 42;
} : null;
false ? function (arg) {
    if (typeof arg === "undefined") { arg = 1; }
    return 43;
} : null;
false ? function (arg) {
    return 44;
} : null;
false ? function (arg) {
    return 45;
} : null;
false ? function (arg) {
    return 46;
} : null;
false ? function (arg) {
    if (typeof arg === "undefined") { arg = 0; }
    return 47;
} : null;
false ? function () {
    var arg = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        arg[_i] = arguments[_i + 0];
    }
    return 48;
} : null;

false ? (function () {
    return 51;
}) : null;
false ? (function (arg) {
    return 52;
}) : null;
false ? (function (arg) {
    if (typeof arg === "undefined") { arg = 1; }
    return 53;
}) : null;
false ? (function (arg) {
    return 54;
}) : null;
false ? (function (arg) {
    return 55;
}) : null;
false ? (function (arg) {
    return 56;
}) : null;
false ? (function (arg) {
    if (typeof arg === "undefined") { arg = 0; }
    return 57;
}) : null;
false ? (function () {
    var arg = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        arg[_i] = arguments[_i + 0];
    }
    return 58;
}) : null;

false ? null : function () {
    return 61;
};
false ? null : function (arg) {
    return 62;
};
false ? null : function (arg) {
    if (typeof arg === "undefined") { arg = 1; }
    return 63;
};
false ? null : function (arg) {
    return 64;
};
false ? null : function (arg) {
    return 65;
};
false ? null : function (arg) {
    return 66;
};
false ? null : function (arg) {
    if (typeof arg === "undefined") { arg = 0; }
    return 67;
};
false ? null : function () {
    var arg = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        arg[_i] = arguments[_i + 0];
    }
    return 68;
};

function (a) {
    return a;
} ? function (b) {
    return b;
} : function (c) {
    return c;
};

function (a) {
    return a;
} ? function (b) {
    return function (c) {
        return 81;
    };
} : function (c) {
    return function (d) {
        return 82;
    };
};

(function (arg) {
    return 90;
}) instanceof Function;
(function (arg) {
    if (typeof arg === "undefined") { arg = 1; }
    return 91;
}) instanceof Function;
(function (arg) {
    return 92;
}) instanceof Function;
(function (arg) {
    return 93;
}) instanceof Function;
(function (arg) {
    if (typeof arg === "undefined") { arg = 1; }
    return 94;
}) instanceof Function;
(function (arg) {
    return 95;
}) instanceof Function;
(function () {
    var arg = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        arg[_i] = arguments[_i + 0];
    }
    return 96;
}) instanceof Function;

'' + function (arg) {
    return 100;
};
(function (arg) {
    return 0;
}) + '' + function (arg) {
    return 101;
};
(function (arg) {
    if (typeof arg === "undefined") { arg = 1; }
    return 0;
}) + '' + function (arg) {
    if (typeof arg === "undefined") { arg = 2; }
    return 102;
};
(function (arg) {
    return 0;
}) + '' + function (arg) {
    return 103;
};
(function (arg) {
    return 0;
}) + '' + function (arg) {
    return 104;
};
(function (arg) {
    if (typeof arg === "undefined") { arg = 1; }
    return 0;
}) + '' + function (arg) {
    if (typeof arg === "undefined") { arg = 2; }
    return 105;
};
(function (arg) {
    if (typeof arg === "undefined") { arg = 1; }
    return 0;
}) + '' + function (arg) {
    if (typeof arg === "undefined") { arg = 2; }
    return 106;
};
(function () {
    var arg = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        arg[_i] = arguments[_i + 0];
    }
    return 0;
}) + '' + function () {
    var arg = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        arg[_i] = arguments[_i + 0];
    }
    return 107;
};
(function (arg1, arg2) {
    return 0;
}) + '' + function (arg1, arg2) {
    return 108;
};
(function (arg1) {
    var arg2 = [];
    for (var _i = 0; _i < (arguments.length - 1); _i++) {
        arg2[_i] = arguments[_i + 1];
    }
    return 0;
}) + '' + function (arg1) {
    var arg2 = [];
    for (var _i = 0; _i < (arguments.length - 1); _i++) {
        arg2[_i] = arguments[_i + 1];
    }
    return 108;
};

function foo() {
    var arg = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        arg[_i] = arguments[_i + 0];
    }
}

foo(function (a) {
    return 110;
}, (function (a) {
    return 111;
}), function (a) {
    return 112;
}, function (a) {
    return 113;
}, function (a, b) {
    return 114;
}, function (a) {
    return 115;
}, function (a) {
    if (typeof a === "undefined") { a = 0; }
    return 116;
}, function (a) {
    if (typeof a === "undefined") { a = 0; }
    return 117;
}, function (a) {
    if (typeof a === "undefined") { a = 0; }
    return 118;
}, function () {
    var a = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        a[_i] = arguments[_i + 0];
    }
    return 119;
}, function (a, b) {
    if (typeof b === "undefined") { b = 0; }
    var c = [];
    for (var _i = 0; _i < (arguments.length - 2); _i++) {
        c[_i] = arguments[_i + 2];
    }
    return 120;
}, function (a) {
    return function (b) {
        return function (c) {
            return 121;
        };
    };
}, false ? function (a) {
    return 0;
} : function (b) {
    return 122;
});
