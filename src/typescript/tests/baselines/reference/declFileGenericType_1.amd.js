var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var C;
(function (C) {
    var A = (function () {
        function A() {
        }
        return A;
    })();
    C.A = A;
    var B = (function () {
        function B() {
        }
        return B;
    })();
    C.B = B;

    function F(x) {
        return null;
    }
    C.F = F;
    function F2(x) {
        return null;
    }
    C.F2 = F2;
    function F3(x) {
        return null;
    }
    C.F3 = F3;
    function F4(x) {
        return null;
    }
    C.F4 = F4;

    function F5() {
        return null;
    }
    C.F5 = F5;

    function F6(x) {
        return null;
    }
    C.F6 = F6;

    var D = (function () {
        function D(val) {
            this.val = val;
        }
        return D;
    })();
    C.D = D;
})(C || (C = {}));

var a;

var b = C.F;
var c = C.F2;
var d = C.F3;
var e = C.F4;

var x = (new C.D(new C.A())).val;

function f() {
}

var g = C.F5();

var h = (function (_super) {
    __extends(h, _super);
    function h() {
        _super.apply(this, arguments);
    }
    return h;
})(C.A);

var j = C.F6;

////[0.d.ts]
declare module C {
    class A<T> {
    }
    class B {
    }
    function F<T>(x: T): A<B>;
    function F2<T>(x: T): A<B>;
    function F3<T>(x: T): A<B>[];
    function F4<T extends C.A<C.B>>(x: T): A<B>[];
    function F5<T>(): T;
    function F6<T extends C.A<C.B>>(x: T): T;
    class D<T> {
        public val: T;
        constructor(val: T);
    }
}
declare var a: C.A<C.B>;
declare var b: <T>(x: T) => C.A<C.B>;
declare var c: <T>(x: T) => C.A<C.B>;
declare var d: <T>(x: T) => C.A<C.B>[];
declare var e: <T extends C.A<C.B>>(x: T) => C.A<C.B>[];
declare var x: C.A<C.B>;
declare function f<T extends C.A<C.B>>(): void;
declare var g: C.A<C.B>;
declare class h extends C.A<C.B> {
}
interface i extends C.A<C.B> {
}
declare var j: <T extends C.A<C.B>>(x: T) => T;
