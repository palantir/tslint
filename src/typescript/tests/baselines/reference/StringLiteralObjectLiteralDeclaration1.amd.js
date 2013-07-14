var m1;
(function (m1) {
    m1.n = { 'foo bar': 4 };
})(m1 || (m1 = {}));

////[0.d.ts]
declare module m1 {
    var n: {
        'foo bar': number;
    };
}
