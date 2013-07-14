function foo(x) {
    return x;
}

var x = foo(5);

////[0.d.ts]
declare function foo<T>(x: T): T;
declare var x: number;
