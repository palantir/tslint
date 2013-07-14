// module then var
module m1 { }
var m1 = 1; // Should be allowed

module m1a { var y = 2; }
var m1a = 1;

module m1b { export var y = 2; }
var m1b = 1;

module m1c {
    export interface I { foo(): void; }
}
var m1c = 1; // Should be allowed

module m1d {
    export class I { foo() { } }
}
var m1d = 1; // error