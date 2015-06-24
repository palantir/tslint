var x: any; // error

function foo(a: any) : any { // 2 errors
    return;
}

let a: any = 2, // error
    b: any = 4; // error

let {a: c, b: d}: {c: any, d: number} = {c: 99, d: 100};  // error
