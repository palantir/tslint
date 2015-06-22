var foo; // failure

function tmp(t: any) {
    var x = 3; // failure
}

var i, // failure
    j;

var [a, b] = [1, 2]; // failure

declare var tmp2: any;

let bar;
const qux;

let k,
    l;

module quz {
    export var i;
}

let [x, y] = [1, 2];
