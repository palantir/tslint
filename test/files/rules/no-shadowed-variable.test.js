function letTesting() {
    var a = 1;
    var b = 1;
    if (true) {
        var a_1 = 2; // failure
        var b_1 = 2; // failure
        var c = 2;
        var e = 2;
    }
    else {
        var b_2 = 3; // failure
        var c = 3;
        var e_1 = 3; // failure
        var f_1 = 3;
    }
    var f = 4;
}
var a = 1;
if (true) {
    var a_2 = 2; // failure
}
var g = 1;
for (var index in [0, 1, 2]) {
    var g = 2; // failure
}
function constTesting() {
    var h = 1;
    var i = 1;
    if (true) {
        var h_1 = 2; // failure
        var i_1 = 2; // failure
    }
}
function testArguments(x, y) {
    var x = 1; // failure
    var y = 2; // tsc error
}
var j = 1;
for (var index in [0, 1, 2]) {
    var j_1 = 2; // failure
}
function testTryStatement() {
    try {
        var foo = 1;
        throw new Error();
    }
    catch (e) {
        var foo = 2;
        var bar = 2;
    }
    finally {
        var foo = 3;
        console.log(bar);
        var bar_1 = 3; // failure
    }
}
testTryStatement();
