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

var passD = {
    a: 1,
    b: {
        aa: 1,
        bb: 2
    },
    c: 3
};

var failD = {
    a: 1,
    c: {
        aa: 1,
        bb: 2
    },
    b: 3
};

var passE = {};

var passF = {
    asdf: [1, 2, 3],
    sdfa: {}
};

var failF = {
    sdfa: {},
    asdf: [1, 2, 3]
};

var passG = {
    asdfn: function () {},
    sdafn: function () {}
};

var failG = {
    sdafn: function () {},
    asdfn: function () {}
};
