var C = (function () {
    function C() {
    }
    return C;
})();

var v1 = new C();

var y = v1.x;

////[0.d.ts]
declare class C<T> {
    public x: T;
}
declare var v1: C<string>;
declare var y: string;
