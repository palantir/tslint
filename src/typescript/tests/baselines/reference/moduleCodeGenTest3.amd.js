var Baz;
(function (Baz) {
    Baz.x = "hello";
})(Baz || (Baz = {}));

Baz.x = "goodbye";
