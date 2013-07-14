var f;
var r = f['foo bar'];

var bar = (function () {
    function bar() {
        bar['hello world'] = 3;
    }
    return bar;
})();

var b;
var r2 = b["hello world"];
var r3 = b["test-property"];
var r4 = b['1'];
var r5 = b[1];
