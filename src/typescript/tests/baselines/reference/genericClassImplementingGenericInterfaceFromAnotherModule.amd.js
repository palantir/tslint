var bar;
(function (bar) {
    var Foo = (function () {
        function Foo() {
        }
        return Foo;
    })();
    bar.Foo = Foo;
})(bar || (bar = {}));

////[0.d.ts]
declare module foo {
    interface IFoo<T> {
    }
}
declare module bar {
    class Foo<T> implements foo.IFoo<T> {
    }
}
