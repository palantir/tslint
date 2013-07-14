var C = (function () {
    function C() {
    }
    return C;
})();

var a;
var b;

////[0.d.ts]
declare class C<T> {
    private x;
}
interface X {
    f(): string;
}
interface Y {
    f(): boolean;
}
declare var a: C<X>;
declare var b: C<Y>;
