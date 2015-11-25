function letTesting() {
    var a = 1;
    let b = 1;

    if (true) {
        let a = 2; // failure
        let b = 2; // failure
        let c = 2;
        var e = 2;
    } else {
        let b = 3; // failure
        let c = 3;
        let e = 3; // failure
        let f = 3;
    }

    var f = 4;
}

let a = 1;
if (true) {
    let a = 2; // failure
}

var g = 1;
for (var index in [0, 1, 2]) {
    var g = 2; // failure
}

function constTesting() {
    var h = 1;
    const i = 1;

    if (true) {
        const h = 2; // failure
        const i = 2; // failure
    }
}

function testArguments(x: number, y: number): void {
    var x = 1; // failure
    let y = 2; // tsc error
}

let j = 1;
for (var index in [0, 1, 2]) { // failure
    let j = 2; // failure
}

function testTryStatement() {
    try {
        let foo = 1;
        throw new Error();
    } catch (e) {
        let foo = 2;
        var bar = 2;
    } finally {
        let foo = 3;
        let bar = 3; // failure
    }
}

function testWhileStatement() {
    let foo = 1;

    while (true) {
        let foo = 2; // failure
    }
}

function testDoStatement() {
    let foo = 1;

    do {
        let foo = 2; // failure
    } while (true);
}

function testDestructuring(x: number) {
    var {y, z} = {y: 2, z: 3};

    function myFunc() {
        return [1];
    }

    function innerFunc() {
        var [foo] = myFunc();
        var [x] = myFunc();   // failure
        let [y] = myFunc();   // failure
        const [z] = myFunc(); // failure
    }

    function anotherInnerFunc() {
        var [{x}] = [{x: 1}];   // failure
        let [[y]] = [[2]];      // failure
        var [foo, ...bar] = [1, 2, 3, 4];
        var [...z] = [1, 2, 3, 4]; // failure
    }
}

function falsePositive1(bar: (okay1: any) => void) {
    let okay1 = 1;
}

function falsePositive2(okay2: any, done: (okay2: any) => void) { }

interface FalsePositive3 {
    diffuse: (pos: number) => number;
    specular: (pos: number) => number;
    pos: number;
}

interface FalsePositive4<T, TResult> {
    (parameters: T, runSynchonous: boolean): TResult;
    (parameters: T, callback: (error: Error, result: TResult) => void): void;
}

let p = 1;
function testParameterDestructuring(
    { pos: p }: FalsePositive3, // failure
    { pos: q, specular: r }: FalsePositive3,
    { pos }: FalsePositive3
) {
    p = 2;
    var q = 1; // failure

    function someInnerFunc() {
        let pos = 3; // failure
    }
}
