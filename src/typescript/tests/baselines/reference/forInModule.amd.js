var Foo;
(function (Foo) {
    for (var i = 0; i < 1; i++) {
        i + i;
    }
})(Foo || (Foo = {}));
