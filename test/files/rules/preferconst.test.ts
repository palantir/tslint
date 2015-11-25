const a = 1;
let b = 1;
let c = 1; // failure

b = 2;

function myFunc(d: number, e: number) {
    let f = 1; // failure
    const g = 1;
    d = 2;
}

let {h, i} = {h: 1, i: 1}; // failure for 'h'
let [j, k] = [1, 1]; // failure for 'j'

i = 2;
k = 2;

function myFunc2() {
    let [l, m] = [1, 1]; // failure for 'l'
    m = 2;
    return l;
}

for (let n of [1, 1]) { // failure for 'n'
    console.log(n);
}

for (let {o, p} of [{1, 1}, {1, 1}]) { // failure for 'o'
    console.log(o);
    p = 2;
}
