var C = (function () {
    function C() {
    }
    return C;
})();

var v1;

var y = v1.x;
var w = v1.y.a;
var z = v1.z.a;

////[0.d.ts]
interface Foo<T> {
    a: T;
}
declare class C<T> {
    public x: T;
    public y: Foo<T>;
    public z: Foo<number>;
}
declare var v1: C<string>;
declare var y: string;
declare var w: string;
declare var z: number;
