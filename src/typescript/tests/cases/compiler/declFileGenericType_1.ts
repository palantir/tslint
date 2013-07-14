// @declaration: true
module C {
    export class A<T>{ }
    export class B { }
    
    export function F<T>(x: T): A<B> { return null; }
    export function F2<T>(x: T): C.A<C.B> { return null; }
    export function F3<T>(x: T): C.A<C.B>[] { return null; }
    export function F4<T extends A<B>>(x: T): Array<C.A<C.B>> { return null; }

    export function F5<T>(): T { return null; }

    export function F6<T extends A<B>>(x: T): T { return null; }

    export class D<T>{

        constructor(public val: T) { }

    }
}

var a: C.A<C.B>;

var b = C.F;
var c = C.F2;
var d = C.F3;
var e = C.F4;

var x = (new C.D<C.A<C.B>>(new C.A<C.B>())).val;

function f<T extends C.A<C.B>>() { }

var g = C.F5<C.A<C.B>>();

class h extends C.A<C.B>{ }

interface i extends C.A<C.B> { }

var j = C.F6;
