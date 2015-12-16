var foo; // failure

function tmp(t: any) {
    var x = 3; // failure
}

var i, // failure
    j;

var [a, b] = [1, 2]; // failure

for (var n; false;); // failure
for (var n1 in foo); // failure
for (var n2 of foo); // failure

declare var tmp2: any;

let bar;
const qux;

let k,
    l;

module quz {
    export var i;
}

let [x, y] = [1, 2];

for (n; false;);
for (let n; false;);
for (let name in foo);
for (let name of foo);
for (const name in foo);
for (const name of foo);
