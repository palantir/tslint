var x = 3;

var y = x; // failure
var z;

export var abcd = 3;

class ABCD {
    constructor() {
        z = 3;
    }
}

try {
  // code here
} catch (e) {
  // e is unused but that's still ok
}

declare var tmp: any;

export function testDestructuring() {
    var [a, b] = [1, 2]; // 2 failures
    var [c] = [3];

    var {d, e} = { d: 1, e: 2 }; // 2 failures
    var {f} = { f: 3 };

    return c * f;
}

export var [foo, bar] = [1, 2];

export function testUnusedSpread() {
  var a = [1, 2]; // 1 failure
  var b = [3, 4];
  var c = [...b, 5]; // make sure we see that b is being used

  return c;

}

for(let e of [1,2,3]) {

}
