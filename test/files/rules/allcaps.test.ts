// lowercase names shouldn't fail
const a;
let b;
var c;
var d, e;
var f = 1;
var g = 2,
    h = 3;

// const shouldn't fail
const A;

// all of these should fail
let B;
var C;
var D, E;
var F = 1;
var G = 2,
    H = 3;
