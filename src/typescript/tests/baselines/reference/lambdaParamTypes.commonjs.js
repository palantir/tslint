var thing = create([{ name: "bob", id: 24 }, { name: "doug", id: 32 }]);

thing.doSomething(function (x, y) {
    return x.name.charAt(0);
});
thing.doSomething(function (x, y) {
    return x.id.toExponential(0);
});
thing.doSomething(function (x, y) {
    return y.name.charAt(0);
});
thing.doSomething(function (x, y) {
    return y.id.toExponential(0);
});

thing.doSomething(function (x, y) {
    return x.foo;
});
thing.doSomething(function (x, y) {
    return y.foo;
});
thing.doSomething(function (x, y) {
    return x.id.charAt(0);
});
thing.doSomething(function (x, y) {
    return x.name.toExponential(0);
});
thing.doSomething(function (x, y) {
    return y.id.charAt(0);
});
thing.doSomething(function (x, y) {
    return y.name.toExponential(0);
});
