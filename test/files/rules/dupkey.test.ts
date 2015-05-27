var a = {
    a: 1,
    b: 2
};

var x = {
    axa: 1,
    bd: 2,
    c: 3,
    axa: 4, // failure
    d: 5,
    ba: 3,
    bd: 6, // failure
    axa: 6 // failure
};

var z = {
    c: [1, 2, 3],
    d: {
        b: "b",
        a: 11,
        c: [11, 22, 33]
    },
    a: 1,
    b: "a"
};

var interspersed = {
    duplicated: 1, // failure
    newContext: {},
    duplicated: 2 // failure
};

var n = {
    constructor: function () {},
    hasOwnProperty: function () {}
};

var foo = {
    ["ab" + "cd"]: "efgh",
    [x.axa]: "bar"
}
