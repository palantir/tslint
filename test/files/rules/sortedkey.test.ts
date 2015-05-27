var passA = {
    a: 1,
    b: 2
};

var failA = {
    b: 1,
    a: 2
};

var passB = {
    a: 1,
    b: 2,
    c: 3,
    d: 4
};

var failB = {
    c: 3,
    a: 1,
    b: 2,
    d: 4
};

var passC = {
    a: 1,
    b: {
        aa: 1,
        bb: 2
    }
};

var failC = {
    a: 1,
    b: {
        bb: 2,
        aa: 1
    }
};

var passD = {};

var passE = {
    asdf: [1, 2, 3],
    sdfa: {}
};

var failE = {
    sdfa: {},
    asdf: [1, 2, 3]
};

var passF = {
    asdfn: function () {},
    sdafn: function () {}
};

var failF = {
    sdafn: function () {},
    asdfn: function () {}
};
