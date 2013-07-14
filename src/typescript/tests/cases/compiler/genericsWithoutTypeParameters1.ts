class C<T> {
    foo(): T { return null }
}

interface I<T> {
    bar(): T;
}

var c1: C;
var i1: I;
var c2: C<I>; // should be an error
var i2: I<C>;  // should be an error

function foo(x: C, y: I) { }
function foo2(x: C<I>, y: I<C>) { }

var x: { a: C } = { a: new C<number>() };
var x2: { a: I } = { a: { bar() { return 1 } } };

class D<T> {
    x: C;
    y: D;
}

interface J<T> {
    x: I;
    y: J;
}