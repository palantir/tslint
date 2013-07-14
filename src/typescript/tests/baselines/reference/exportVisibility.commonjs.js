var Foo = (function () {
    function Foo() {
    }
    return Foo;
})();
exports.Foo = Foo;

exports.foo = new Foo();

function test(foo) {
    return true;
}
exports.test = test;

